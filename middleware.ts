import { NextRequest, NextResponse } from "next/server";
import { getSessionUser, SESSION_COOKIE, getCookieValue } from "@/lib/auth";

const protectedPaths = ["/dashboard", "/courses"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) {
    token = getCookieValue(request.headers.get("cookie"), SESSION_COOKIE);
  }
  const isProtectedRoute = protectedPaths.some((path) => pathname.startsWith(path));
  
  const sessionUser = await getSessionUser(token).catch(() => null);

  if (pathname === "/login" && sessionUser) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedRoute && !sessionUser) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*", "/courses/:path*"],
};
