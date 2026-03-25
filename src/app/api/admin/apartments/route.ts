import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

async function auth(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return null;
}

// GET all apartments (admin — includes inactive)
export async function GET(req: NextRequest) {
  const err = await auth(req); if (err) return err;
  const db = getDb();
  const rows = db.prepare('SELECT * FROM apartments ORDER BY sort_order ASC, id ASC').all();
  return NextResponse.json(rows);
}

// POST — create new apartment
export async function POST(req: NextRequest) {
  const err = await auth(req); if (err) return err;
  const db = getDb();
  const body = await req.json();
  const {
    name, location, description, bedrooms, bathrooms,
    amenities, airbnb_url, booking_url, holidayfuture_url,
    photos, cover_photo, sort_order, active,
  } = body;

  const result = db.prepare(`
    INSERT INTO apartments
      (name, location, description, bedrooms, bathrooms, amenities, airbnb_url, booking_url, holidayfuture_url, photos, cover_photo, sort_order, active)
    VALUES
      (@name, @location, @description, @bedrooms, @bathrooms, @amenities, @airbnb_url, @booking_url, @holidayfuture_url, @photos, @cover_photo, @sort_order, @active)
  `).run({
    name: name || '',
    location: location || 'Las Americas, Tenerife',
    description: description || '',
    bedrooms: bedrooms || 1,
    bathrooms: bathrooms || 1,
    amenities: Array.isArray(amenities) ? JSON.stringify(amenities) : (amenities || '[]'),
    airbnb_url: airbnb_url || '',
    booking_url: booking_url || '',
    holidayfuture_url: holidayfuture_url || '',
    photos: Array.isArray(photos) ? JSON.stringify(photos) : (photos || '[]'),
    cover_photo: cover_photo || '',
    sort_order: sort_order || 0,
    active: active !== undefined ? active : 1,
  });

  const newApt = db.prepare('SELECT * FROM apartments WHERE id = ?').get(result.lastInsertRowid);
  return NextResponse.json(newApt, { status: 201 });
}
