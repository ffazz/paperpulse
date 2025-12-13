import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { authConfig } from './auth.config'
import bcrypt from 'bcryptjs'

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { 
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
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
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[AUTH] Authorize called')
        
        if (!credentials?.email || !credentials?.password) {
          console.log('[AUTH] Missing email or password')
          return null
        }

        const email = credentials.email as string
        const password = credentials.password as string

        console.log('[AUTH] Attempting to authenticate:', email)

        try {
          // Validate email format
          if (!email.includes('@')) {
            console.log('[AUTH] Invalid email format')
            return null
          }

          // Lookup user
          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            console.log('[AUTH] User not found:', email)
            return null
          }

          if (!user.password) {
            console.log('[AUTH] User has no password hash')
            return null
          }

          // Compare password
          console.log('[AUTH] Comparing passwords...')
          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) {
            console.log('[AUTH] Password mismatch')
            return null
          }

          console.log('[AUTH] ✓ Authentication successful:', email)

          // Return user object with required fields
          return {
            id: user.id,
            email: user.email,
            name: user.name || 'User',
            image: user.image,
          }
        } catch (error) {
          console.error('[AUTH] Error in authorize:', error instanceof Error ? error.message : error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('[JWT] Token callback - user present:', !!user)
      if (user) {
        console.log('[JWT] Setting token.id:', user.id)
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      console.log('[SESSION] Session callback - token.id:', token.id)
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  logger: {
    error: (code, ...message) => {
      console.error('[NextAuth Error]', code, ...message)
    },
    warn: (code, ...message) => {
      console.warn('[NextAuth Warn]', code, ...message)
    },
    debug: (code, ...message) => {
      console.debug('[NextAuth Debug]', code, ...message)
    },
  },
})
