
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasEnteredPin = request.cookies.get('hasEnteredPin')?.value === 'true'

  // If a user tries to access any main application page without having entered their PIN,
  // redirect them to the PIN entry screen.
  if (pathname.startsWith('/dashboard') && !hasEnteredPin) {
    return NextResponse.redirect(new URL('/enter-pin', request.url))
  }
  
  if (pathname.startsWith('/transfer') && !hasEnteredPin) {
    return NextResponse.redirect(new URL('/enter-pin', request.url))
  }
  
  if (pathname.startsWith('/budgets') && !hasEnteredPin) {
    return NextResponse.redirect(new URL('/enter-pin', request.url))
  }

  // Allow all other requests to proceed.
  return NextResponse.next()
}

// Apply this middleware ONLY to the routes that need PIN protection.
export const config = {
  matcher: ['/dashboard/:path*', '/transfer/:path*', '/budgets/:path*'],
}
