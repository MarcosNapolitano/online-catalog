import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/app/_services/auth'
import NotFound from '@/app/not-found'

export async function middleware(request: NextRequest) {

  if (process.env.NODE_ENV == "development") {

    const isAuthenticated = request.cookies.has('auth_token');
    const user = request.cookies.get('userName')?.value;
    const isRouteAdmin = request.nextUrl.pathname.startsWith("./admin");
    const isRouteApi = request.nextUrl.pathname.startsWith("./api");

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    };

    if (user != "marcos" && (isRouteAdmin || isRouteApi)){
      return NextResponse.error()
    };
  };

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Apply middleware to all pages except:
     * 2. /login (exclude the login page)
     * 3. /_next/* (exclude Next.js assets, e.g., /_next/static/*)
     */
    '/((?!login|_next/static|_next/image).*)',
  ],
};
