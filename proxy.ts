import createMiddleware from 'next-intl/middleware'
import { auth } from '@/lib/auth'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect /admin routes (locale-agnostic check)
  const isAdminRoute = pathname.includes('/admin')
  if (isAdminRoute) {
    const session = await auth()
    if (!session) {
      const locale = pathname.startsWith('/en') ? 'en' : 'ro'
      const loginUrl = new URL(`/${locale}/auth/login`, request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    // Skip Next.js internals, API routes, and all static files (anything with an extension)
    '/((?!api|_next|.*\\..*).*)',
  ],
}
