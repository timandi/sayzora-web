import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionFromRequest } from "@/lib/auth";

type Params = Promise<{ id: string }>;

async function auth(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const err = await auth(req);
  if (err) return err;
  const { id } = await params;
  const db = getDb();
  const row = db.prepare("SELECT * FROM apartments WHERE id = ?").get(id);
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const err = await auth(req);
  if (err) return err;
  const { id } = await params;
  const db = getDb();
  const body = await req.json();

  const existing = db.prepare("SELECT * FROM apartments WHERE id = ?").get(id);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const merged = { ...(existing as object), ...body } as Record<string, unknown>;

  db.prepare(
    `
    UPDATE apartments SET
      name=@name, location=@location, description=@description,
      bedrooms=@bedrooms, bathrooms=@bathrooms, amenities=@amenities,
      airbnb_url=@airbnb_url, booking_url=@booking_url, holidayfuture_url=@holidayfuture_url,
      photos=@photos, cover_photo=@cover_photo, sort_order=@sort_order, active=@active,
      updated_at=datetime('now')
    WHERE id=@id
  `,
  ).run({
    ...merged,
    id,
    amenities: Array.isArray(merged.amenities) ? JSON.stringify(merged.amenities) : merged.amenities,
    photos: Array.isArray(merged.photos) ? JSON.stringify(merged.photos) : merged.photos,
  });

  return NextResponse.json(db.prepare("SELECT * FROM apartments WHERE id = ?").get(id));
}

export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const err = await auth(req);
  if (err) return err;
  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM apartments WHERE id = ?").run(id);
  return NextResponse.json({ ok: true });
}
