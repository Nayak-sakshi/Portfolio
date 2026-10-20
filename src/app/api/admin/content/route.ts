import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getContent, saveContent } from "@/lib/store";
import { contentSchema } from "@/lib/types";

export async function GET() {
  return NextResponse.json(await getContent());
}

export async function PUT(req: Request) {
  const parsed = contentSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json({ error: `${issue.path.join(" › ")}: ${issue.message}` }, { status: 400 });
  }
  await saveContent(parsed.data);
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
