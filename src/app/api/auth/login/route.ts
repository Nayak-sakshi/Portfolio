import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { createSession, SESSION_COOKIE } from "@/lib/auth";
import { clientIp, rateLimit } from "@/lib/rateLimit";

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(req: Request) {
  const limit = rateLimit(`login:${clientIp(req)}`, 5, 15 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return NextResponse.json({ error: "ADMIN_PASSWORD is not configured" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  if (typeof body.password !== "string" || !safeEqual(body.password, expected)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const { token, maxAge } = await createSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  });
  return res;
}
