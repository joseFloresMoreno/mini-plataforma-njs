import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { findLoginUser, pickSessionUser, signSessionToken, SESSION_COOKIE } from "@/lib/auth";

type LoginBody = {
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LoginBody | null;

  if (!body?.email || !body?.password) {
    return NextResponse.json(
      { error: "Debes completar correo y contraseña." },
      { status: 400 },
    );
  }

  const user = findLoginUser(body.email, body.password);

  if (!user) {
    return NextResponse.json(
      { error: "Credenciales inválidas." },
      { status: 401 },
    );
  }

  const token = await signSessionToken(user);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ 
    user: pickSessionUser(user),
    token
  });
}
