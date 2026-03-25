import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  const page = req.nextUrl.searchParams.get("page");
  const rows = page ? db.prepare("SELECT * FROM page_content WHERE page = ?").all(page) : db.prepare("SELECT * FROM page_content").all();
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  const { page, key, value } = await req.json();
  db.prepare(
    `
    INSERT INTO page_content (page, key, value) VALUES (?, ?, ?)
    ON CONFLICT(page, key) DO UPDATE SET value=excluded.value, updated_at=datetime('now')
  `,
  ).run(page, key, value);
  return NextResponse.json({ ok: true });
}
