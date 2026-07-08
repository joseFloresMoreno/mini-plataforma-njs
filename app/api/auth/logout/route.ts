import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/auth";

async function buildLogoutResponse(request: Request) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });

  return NextResponse.redirect(new URL("/", request.url));
}

export async function GET(request: Request) {
  return await buildLogoutResponse(request);
}

export async function POST(request: Request) {
  return await buildLogoutResponse(request);
}
