import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { saveListing, getListings } from "@/lib/store";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const listingId = parseInt(id, 10);
  if (isNaN(listingId)) return NextResponse.json({ error: "Invalid id" }, { status: 400 });

  const updates = await req.json();

  // Verify listing exists
  const all = await getListings();
  const existing = all.find((l) => l.listingId === listingId);
  if (!existing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

  await saveListing(listingId, updates);
  return NextResponse.json({ ok: true });
}
