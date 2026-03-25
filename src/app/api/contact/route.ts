import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { first_name, last_name, email, subject, message } = await req.json();
    if (!first_name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const db = getDb();
    db.prepare("INSERT INTO contact_submissions (name, email, subject, message) VALUES (?, ?, ?, ?)").run(`${first_name} ${last_name}`.trim(), email, subject || "", message);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Error saving message" }, { status: 500 });
  }
}
