import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Protected routes - require login
  const protectedPaths = ['/dashboard', '/users', '/logs', '/ai', '/documents', '/cms', '/reports'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Role-based guards
  const role = (session?.user as any)?.role;
  const adminOnlyPaths = ['/users'];
  const superAdminOnlyPaths = ['/cms'];

  if (adminOnlyPaths.some((p) => pathname.startsWith(p))) {
    if (!['super_admin', 'admin'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  if (superAdminOnlyPaths.some((p) => pathname.startsWith(p))) {
    if (role !== 'super_admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
  }

  // Redirect root to dashboard or login
  if (pathname === '/') {
    return NextResponse.redirect(new URL(session ? '/dashboard' : '/login', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
