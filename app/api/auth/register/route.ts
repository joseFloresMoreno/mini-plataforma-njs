import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getDemoUserByEmail, saveDbUser, type DemoUser } from "@/lib/lms-data";
import { pickSessionUser, SESSION_COOKIE } from "@/lib/auth";

type RegisterBody = {
  name?: string;
  email?: string;
  password?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as RegisterBody | null;

  if (!body?.name || !body?.email || !body?.password) {
    return NextResponse.json(
      { error: "Debes completar nombre, correo y contraseña." },
      { status: 400 },
    );
  }

  const existingUser = await getDemoUserByEmail(body.email);
  if (existingUser) {
    return NextResponse.json(
      { error: "El correo electrónico ya está registrado." },
      { status: 400 },
    );
  }

  const newUser: DemoUser = {
    id: `user-${Date.now()}`,
    name: body.name,
    email: body.email,
    password: body.password,
    role: "student",
    enrolledCourseIds: [],
  };

  await saveDbUser(newUser);

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, newUser.id, {
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return NextResponse.json({
    user: pickSessionUser(newUser),
    token: newUser.id,
  });
}
