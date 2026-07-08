import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, SESSION_COOKIE } from "@/lib/auth";

const protectedPaths = ["/dashboard", "/courses"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));
  
  let sessionUser = null;
  try {
    sessionUser = await getSessionUser(token);
    console.log(`[Middleware] Path: ${pathname}, Token exists: ${!!token}, User: ${sessionUser?.email ?? "null"}`);
  } catch (err: any) {
    console.error(`[Middleware] Error in getSessionUser:`, err.message || err);
  }

  if (pathname === "/login" && sessionUser) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute && !sessionUser) {
    console.log(`[Middleware] Redirecting to login. Path: ${pathname}`);
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/courses/:path*"],
};
