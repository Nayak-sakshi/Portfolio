import { NextResponse } from "next/server";
import { deleteMessage, updateMessage } from "@/lib/store";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Ctx) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  await updateMessage(id, { read: Boolean(body.read) });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const { id } = await params;
  await deleteMessage(id);
  return NextResponse.json({ ok: true });
}
