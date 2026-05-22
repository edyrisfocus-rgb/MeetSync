import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET });

  const protectedPaths = ['/dashboard', '/users', '/logs', '/ai', '/documents', '/cms', '/reports'];
  const isProtected = protectedPaths.some((p) => pathname.startsWith(p));

  if (isProtected && !token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = typeof token?.role === 'string' ? token.role : '';
  const adminOnlyPaths = ['/users'];
  const superAdminOnlyPaths = ['/cms'];

  if (adminOnlyPaths.some((p) => pathname.startsWith(p)) && !['super_admin', 'admin'].includes(role)) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (superAdminOnlyPaths.some((p) => pathname.startsWith(p)) && role !== 'super_admin') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL(token ? '/dashboard' : '/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
