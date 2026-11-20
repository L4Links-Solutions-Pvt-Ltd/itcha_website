import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySession } from './lib/session';

// First line of defence for /admin. Every admin page and server action also calls requireAdmin().
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();
  const ok = await verifySession(req.cookies.get(SESSION_COOKIE)?.value).catch(() => null);
  if (!ok) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
