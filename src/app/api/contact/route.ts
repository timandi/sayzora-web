import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { first_name, last_name, email, subject, message } = await req.json();
    if (!first_name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    // Log to server console (visible in Vercel Function logs)
    console.log("[contact]", { name: `${first_name} ${last_name}`.trim(), email, subject, message });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error processing message" }, { status: 500 });
  }
}
