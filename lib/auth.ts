import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import type { SessionOptions } from "iron-session";

export interface SessionData {
  isAuthenticated: boolean;
}

// iron-session requires ≥32 characters. Use a dedicated secret, not the admin password.
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  process.env.ADMIN_PASSWORD ||
  "fallback-dev-password-at-least-32-characters!!";

export const sessionOptions: SessionOptions = {
  password: SESSION_SECRET.length >= 32 ? SESSION_SECRET : SESSION_SECRET.padEnd(32, "0"),
  cookieName: "project-library-admin",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
