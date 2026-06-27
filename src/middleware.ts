import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'constitution-atlas-super-secret-key-123456'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminPath = pathname.startsWith('/admin');
  const isLearningPath = pathname.startsWith('/learning');

  const sessionToken = request.cookies.get('session')?.value;

  if (isAdminPath || isLearningPath) {
    if (!sessionToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(sessionToken, JWT_SECRET);
      const role = payload.role as string;

      if (isAdminPath && role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('session');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/learning/:path*'],
};
