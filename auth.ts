import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password too short'),
})

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  events: {
    async signIn({ user }) {
      console.log('[EVENT] User signed in:', user.email)
    },
    async signOut() {
      console.log('[EVENT] User signed out')
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        console.log('[AUTH] Authorize function called')
        console.log('[AUTH] Credentials received:', JSON.stringify(credentials))
        
        // Hardcoded test return
        if (credentials?.email === 'test@example.com' && credentials?.password === 'password123') {
          console.log('[AUTH] ✓ Test credentials accepted')
          return {
            id: 'cmj0v0npk0000ct50zv6f9slv',
            email: 'test@example.com',
            name: 'Test User',
            image: null,
          }
        }
        
        // Real database lookup
        if (!credentials?.email || !credentials?.password) {
          console.log('[AUTH] Missing email or password')
          return null
        }

        try {
          const result = credentialsSchema.safeParse({
            email: credentials.email as string,
            password: credentials.password as string,
          })
          
          if (!result.success) {
            console.error('[AUTH] Validation failed:', result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`))
            return null
          }

          const { email, password } = result.data
          console.log('[AUTH] Looking up user:', email)
          
          const user = await prisma.user.findUnique({ 
            where: { email },
          })
          
          if (!user) {
            console.log('[AUTH] User not found for email:', email)
            return null
          }
          
          if (!user.password) {
            console.log('[AUTH] User has no password hash')
            return null
          }

          console.log('[AUTH] Comparing passwords...')
          const passwordMatch = await bcrypt.compare(password, user.password)
          
          if (!passwordMatch) {
            console.log('[AUTH] Password does not match')
            return null
          }

          console.log('[AUTH] ✓ Authentication successful for:', email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('[AUTH] Critical error in authorize:', error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('[JWT] Token callback - user:', !!user)
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      console.log('[SESSION] Session callback')
      if (token && session.user) session.user.id = token.id as string
      return session
    },
  },
  logger: {
    error(code, ...message) {
      console.error('[NextAuth Error]', code, ...message)
    },
    warn(code, ...message) {
      console.warn('[NextAuth Warn]', code, ...message)
    },
    debug(code, ...message) {
      console.debug('[NextAuth Debug]', code, ...message)
    },
  },
})
