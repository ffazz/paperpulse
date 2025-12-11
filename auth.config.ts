import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnProfile = nextUrl.pathname.startsWith('/profile')
      const isOnFavorites = nextUrl.pathname.startsWith('/favorites')
      
      if (isOnDashboard || isOnProfile || isOnFavorites) {
        if (isLoggedIn) return true
        return false
      }
      
      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
