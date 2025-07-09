
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'

  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/enter-pin', request.url))
  }
  
  // If the user is logged in and trying to access a protected dashboard route...
  if (isLoggedIn && pathname.startsWith('/dashboard')) {
    // ...check if they have entered their PIN in this session.
    const hasEnteredPin = request.cookies.get('hasEnteredPin')?.value === 'true'
    // If not, redirect them back to the PIN entry screen.
    if (!hasEnteredPin) {
      return NextResponse.redirect(new URL('/enter-pin', request.url))
    }
  }

  // If the user tries to go to the PIN entry page without being logged in first...
  if (pathname === '/enter-pin') {
    // ...redirect them to the login page.
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

// Apply this middleware to the specified routes.
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/enter-pin'],
}
