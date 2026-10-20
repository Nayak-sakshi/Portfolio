import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 8; // 8 hours

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 32) throw new Error("AUTH_SECRET must be set (32+ characters)");
  return new TextEncoder().encode(s);
}

export async function createSession() {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  return { token, maxAge: MAX_AGE };
}

export async function verifySession(token: string | undefined) {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    return payload.role === "admin";
  } catch {
    return false;
  }
}
