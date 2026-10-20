import { NextResponse } from "next/server";
import { listMessages } from "@/lib/store";

export async function GET() {
  return NextResponse.json(await listMessages());
}
