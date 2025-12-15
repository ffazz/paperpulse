import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import { metrics } from '@/lib/metrics'

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Skip metrics collection for the metrics endpoint itself
  if (!pathname.startsWith('/api/metrics')) {
    const startTime = Date.now()
    
    // Track request
    metrics.increment('http_requests_total', {
      method: req.method,
      route: pathname,
    })

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

    // Record response time
    const duration = (Date.now() - startTime) / 1000
    metrics.recordHistogram('http_request_duration_seconds', duration, {
      method: req.method,
      route: pathname,
      status: response.status.toString(),
    })

    return response
  }

  const protectedRoutes = ['/dashboard', '/profile', '/favorites', '/reading-lists', '/circle']
  const authRoutes = ['/auth/signin', '/auth/signup']

  if (protectedRoutes.some((r) => pathname.startsWith(r)) && !isLoggedIn) {
    return NextResponse.redirect(new URL('/auth/signin', req.url))
  }

  if (authRoutes.some((r) => pathname.startsWith(r)) && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
