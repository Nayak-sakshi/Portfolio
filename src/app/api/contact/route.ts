import { NextResponse } from "next/server";
import { addMessage, getContent } from "@/lib/store";
import { messageSchema } from "@/lib/types";
import { clientIp, rateLimit } from "@/lib/rateLimit";

async function notifyByEmail(to: string, msg: { name: string; email: string; message: string }) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO || to],
      reply_to: msg.email,
      subject: `New portfolio message from ${msg.name}`,
      text: `${msg.message}\n\n— ${msg.name} <${msg.email}>`,
    }),
  });
  if (!res.ok) console.error("[contact] email failed", res.status, await res.text());
}

export async function POST(req: Request) {
  const limit = rateLimit(`contact:${clientIp(req)}`, 3, 10 * 60 * 1000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `You've sent a few already. Try again in ${Math.ceil(limit.retryAfter / 60)} min.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const parsed = messageSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
  }
  const { company, ...msg } = parsed.data;
  if (company) return NextResponse.json({ ok: true }); // bot filled the honeypot

  await addMessage(msg);
  try {
    await notifyByEmail((await getContent()).profile.email, msg);
  } catch (err) {
    console.error("[contact] email failed", err);
  }
  return NextResponse.json({ ok: true });
}
