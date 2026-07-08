import { SignJWT, jwtVerify } from "jose";
import { getDemoUserByEmail, getDemoUserById, type DemoUser } from "@/lib/lms-data";

export const SESSION_COOKIE = "lms_session";

const secretKey = new TextEncoder().encode(
  "lms-static-production-secret-key-987654321",
);

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: DemoUser["role"];
  initials: string;
};

export function pickSessionUser(user: DemoUser): SessionUser {
  const initials = user.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    initials,
  };
}

export async function signSessionToken(user: DemoUser) {
  return new SignJWT({
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey);
}

export async function getSessionUser(token?: string | null) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, secretKey);
    const userId = typeof payload.userId === "string" ? payload.userId : payload.sub;

    if (!userId) {
      return null;
    }

    const user = getDemoUserById(userId);

    return user ? pickSessionUser(user) : null;
  } catch {
    return null;
  }
}

export function findLoginUser(email: string, password: string) {
  const user = getDemoUserByEmail(email);

  if (!user || user.password !== password) {
    return null;
  }

  return user;
}
