import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { metrics } from '@/lib/metrics'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  
  const startTime = Date.now()

  const protectedRoutes = ['/dashboard', '/profile', '/favorites', '/reading-lists', '/circle']
  const authRoutes = ['/auth/signin', '/auth/signup']

  let response: NextResponse

  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !isLoggedIn) {
    response = NextResponse.redirect(new URL('/auth/signin', req.url))
  } else if (authRoutes.some((r) => pathname.startsWith(r)) && isLoggedIn) {
    response = NextResponse.redirect(new URL('/dashboard', req.url))
  } else {
    response = NextResponse.next()
  }

  // Track metrics for all requests except the metrics endpoint itself
  if (!pathname.startsWith('/api/metrics') && !pathname.startsWith('/_next')) {
    try {
      // Track request
      metrics.increment('http_requests_total', {
        method: req.method,
        route: pathname,
        status: response.status.toString(),
      })

      // Record response time
      const duration = (Date.now() - startTime) / 1000
      metrics.recordHistogram('http_request_duration_seconds', duration, {
        method: req.method,
        route: pathname,
        status: response.status.toString(),
      })
      
      console.log(`[METRICS] Recorded: ${req.method} ${pathname} - ${response.status} (${duration.toFixed(3)}s)`)
    } catch (error) {
      console.error('[METRICS] Error recording metrics:', error)
    }
  }

  return response
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
