import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { getPageContent, savePageContent } from "@/lib/store";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const page = req.nextUrl.searchParams.get("page");
  if (!page) return NextResponse.json({ error: "page param required" }, { status: 400 });
  const content = await getPageContent(page);
  return NextResponse.json(Object.entries(content).map(([key, value]) => ({ key, value })));
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { page, key, value } = await req.json();
  await savePageContent(page, key, value);
  return NextResponse.json({ ok: true });
}
