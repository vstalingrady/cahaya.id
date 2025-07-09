
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // The AuthProvider component handles redirecting unauthenticated users for all routes.
  // This middleware is now only responsible for enforcing the PIN screen as a second
  // layer of security for the dashboard area.
  const hasEnteredPin = request.cookies.get('hasEnteredPin')?.value === 'true'

  // If a user tries to access any dashboard page without having entered their PIN,
  // redirect them to the PIN entry screen.
  if (pathname.startsWith('/dashboard') && !hasEnteredPin) {
    return NextResponse.redirect(new URL('/enter-pin', request.url));
  }
  
  // If a user who has already entered their PIN tries to go back to the PIN screen,
  // redirect them to the dashboard to prevent them from getting stuck.
  if (pathname === '/enter-pin' && hasEnteredPin) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow all other requests to proceed.
  return NextResponse.next()
}

// Apply this middleware only to the routes that need PIN protection.
export const config = {
  matcher: ['/dashboard/:path*', '/enter-pin'],
}
