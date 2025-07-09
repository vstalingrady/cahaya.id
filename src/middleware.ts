
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'
  const hasEnteredPin = request.cookies.get('hasEnteredPin')?.value === 'true'

  const onLoginPage = pathname === '/login';

  // If user is logged in and tries to access the login page, redirect them.
  // This is the key fix for the Google Sign-In issue.
  if (isLoggedIn && onLoginPage) {
    return NextResponse.redirect(new URL('/enter-pin', request.url));
  }

  // If trying to access a protected area (dashboard or sub-pages)
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (!hasEnteredPin) {
      return NextResponse.redirect(new URL('/enter-pin', request.url))
    }
  }

  // If trying to access the PIN page
  if (pathname === '/enter-pin') {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    // If they already entered the PIN, send them to dashboard
    if (hasEnteredPin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

// Apply this middleware to the specified routes.
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/enter-pin'],
}
