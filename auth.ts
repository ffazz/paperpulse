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
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        console.log('[AUTH] Authorize called')
        console.log('[AUTH] Credentials:', credentials)
        
        if (!credentials) {
          console.error('[AUTH] No credentials provided')
          return null
        }

        try {
          const parsed = credentialsSchema.safeParse(credentials)
          
          if (!parsed.success) {
            console.error('[AUTH] Validation error:', parsed.error.issues)
            return null
          }

          const { email, password } = parsed.data
          console.log('[AUTH] Attempting login for:', email)
          
          const user = await prisma.user.findUnique({ 
            where: { email },
          })
          
          if (!user) {
            console.error('[AUTH] User not found:', email)
            return null
          }
          
          if (!user.password) {
            console.error('[AUTH] User has no password hash:', email)
            return null
          }

          const passwordMatch = await bcrypt.compare(password, user.password)
          
          if (!passwordMatch) {
            console.error('[AUTH] Password mismatch for user:', email)
            return null
          }

          console.log('[AUTH] Login successful for:', email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('[AUTH] Authorize error:', error)
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
