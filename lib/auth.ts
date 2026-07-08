import { getDemoUserByEmail, getDemoUserById, type DemoUser } from "@/lib/lms-data";

export const SESSION_COOKIE = "lms_session";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: DemoUser["role"];
  initials: string;
};

export function getCookieValue(cookieString: string | null | undefined, name: string): string | undefined {
  if (!cookieString) return undefined;
  const cookiesList = cookieString.split(";");
  for (const cookie of cookiesList) {
    const parts = cookie.split("=");
    const cookieName = parts[0]?.trim();
    if (cookieName === name) {
      return parts.slice(1).join("=");
    }
  }
  return undefined;
}

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
  // Return the raw userId as the token for 100% reliability
  return user.id;
}

export async function getSessionUser(token?: string | null) {
  if (!token) {
    return null;
  }

  try {
    const user = getDemoUserById(token);
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
