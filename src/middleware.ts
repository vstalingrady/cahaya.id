
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLoggedIn = request.cookies.get('isLoggedIn')?.value === 'true'

  if (isLoggedIn && pathname === '/login') {
    return NextResponse.redirect(new URL('/enter-pin', request.url))
  }
  
  if (isLoggedIn && pathname.startsWith('/dashboard')) {
    const hasEnteredPin = request.cookies.get('hasEnteredPin')?.value === 'true'
    if (!hasEnteredPin) {
      return NextResponse.redirect(new URL('/enter-pin', request.url))
    }
  }

  if (pathname === '/enter-pin') {
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/enter-pin'],
}
