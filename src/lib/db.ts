import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH || './data/sayzora.db';
const resolvedPath = path.resolve(process.cwd(), DB_PATH);

// Ensure the data directory exists
const dir = path.dirname(resolvedPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

let db: Database.Database;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(resolvedPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initSchema(db);
  }
  return db;
}

function initSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS apartments (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      name             TEXT NOT NULL,
      location         TEXT NOT NULL DEFAULT 'Las Americas, Tenerife',
      description      TEXT NOT NULL DEFAULT '',
      bedrooms         INTEGER NOT NULL DEFAULT 1,
      bathrooms        INTEGER NOT NULL DEFAULT 1,
      amenities        TEXT NOT NULL DEFAULT '[]',
      airbnb_url       TEXT NOT NULL DEFAULT '',
      booking_url      TEXT NOT NULL DEFAULT '',
      holidayfuture_url TEXT NOT NULL DEFAULT '',
      photos           TEXT NOT NULL DEFAULT '[]',
      cover_photo      TEXT NOT NULL DEFAULT '',
      sort_order       INTEGER NOT NULL DEFAULT 0,
      active           INTEGER NOT NULL DEFAULT 1,
      created_at       TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at       TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS page_content (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      page       TEXT NOT NULL,
      key        TEXT NOT NULL,
      value      TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(page, key)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key        TEXT PRIMARY KEY,
      value      TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS contact_submissions (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      name       TEXT NOT NULL,
      email      TEXT NOT NULL,
      subject    TEXT NOT NULL DEFAULT '',
      message    TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  seedIfEmpty(db);
}

function seedIfEmpty(db: Database.Database) {
  const count = (db.prepare('SELECT COUNT(*) as c FROM apartments').get() as { c: number }).c;
  if (count > 0) return;

  const insert = db.prepare(`
    INSERT INTO apartments (name, location, description, bedrooms, bathrooms, amenities, airbnb_url, booking_url, holidayfuture_url, photos, cover_photo, sort_order)
    VALUES (@name, @location, @description, @bedrooms, @bathrooms, @amenities, @airbnb_url, @booking_url, @holidayfuture_url, @photos, @cover_photo, @sort_order)
  `);

  const bookingBase = process.env.NEXT_PUBLIC_BOOKING_URL || 'https://126222_1.holidayfuture.com/';

  const apartments = [
    { name: 'Panoramic Floor', location: 'Las Americas, Tenerife', description: 'Stunning panoramic apartment with breathtaking sea views, a private terrace, and access to the communal pool. Perfect for families or couples seeking luxury.', bedrooms: 2, bathrooms: 2, amenities: JSON.stringify(['Sea Views', 'Terrace', 'Pool', 'Air Conditioning', 'WiFi', 'Fully Equipped Kitchen']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 1 },
    { name: 'Atlantic Sunset Floor', location: 'Las Americas, Tenerife', description: 'Wake up to Atlantic sunsets every morning. This elegant apartment features a walk-in shower and sweeping sea views from the living area.', bedrooms: 1, bathrooms: 1, amenities: JSON.stringify(['Sea Views', 'Walk-in Shower', 'Air Conditioning', 'WiFi', 'Balcony']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 2 },
    { name: 'Beach View', location: 'Las Americas, Tenerife', description: 'Freshly renovated beachfront apartment with a private entrance. Steps from the sand with stylish interiors and modern amenities.', bedrooms: 1, bathrooms: 1, amenities: JSON.stringify(['Beachfront', 'Private Entrance', 'Renovated', 'Air Conditioning', 'WiFi']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 3 },
    { name: 'Premier View Las Americas', location: 'Las Americas, Tenerife', description: 'Premium apartment with balcony sea views, outdoor pool, and lush garden. Ideal for those who want space and luxury.', bedrooms: 2, bathrooms: 1, amenities: JSON.stringify(['Sea Views', 'Balcony', 'Outdoor Pool', 'Garden', 'Air Conditioning', 'WiFi']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 4 },
    { name: 'Ocean View', location: 'Las Americas, Tenerife', description: 'Accessible and stylish apartment with pool views and full air conditioning. Equipped for guests with reduced mobility.', bedrooms: 1, bathrooms: 1, amenities: JSON.stringify(['Pool Views', 'Air Conditioning', 'Disabled Access', 'WiFi', 'Ground Floor']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 5 },
    { name: 'Torres del Sol – 12th Floor', location: 'Torres del Sol, Tenerife', description: 'Perched on the 12th floor with dramatic Teide volcano and Atlantic views. Exclusive access to private beach area.', bedrooms: 1, bathrooms: 1, amenities: JSON.stringify(['Teide View', 'Atlantic View', 'Private Beach Area', 'WiFi', 'Air Conditioning']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 6 },
    { name: 'Torres del Sol – 11th Floor', location: 'Torres del Sol, Tenerife', description: 'Atlantic views from the 11th floor, smart TV with streaming, and access to kids pool. Great for families.', bedrooms: 1, bathrooms: 1, amenities: JSON.stringify(['Atlantic View', 'Streaming TV', 'Kids Pool', 'WiFi', 'Air Conditioning']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 7 },
    { name: 'Sol 9th Floor', location: 'Torres del Sol, Tenerife', description: 'Mountain and ocean views combine on the 9th floor with a private pool — rare, relaxing and completely memorable.', bedrooms: 1, bathrooms: 1, amenities: JSON.stringify(['Teide View', 'Atlantic View', 'Private Pool', 'Mountain View', 'WiFi']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 8 },
    { name: 'Spanish Sunrise', location: 'Las Americas, Tenerife', description: 'Two-bedroom apartment with mountain balcony views and classic Spanish character. A cosy and authentic stay.', bedrooms: 2, bathrooms: 1, amenities: JSON.stringify(['Mountain Views', 'Balcony', 'Bidet', 'Air Conditioning', 'WiFi']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 9 },
    { name: 'Central Charm', location: 'Las Americas, Tenerife', description: 'Garden view apartment in the heart of Las Americas, a short walk to the famous El Bunker beach.', bedrooms: 1, bathrooms: 1, amenities: JSON.stringify(['Garden Views', 'Near El Bunker Beach', 'Air Conditioning', 'WiFi', 'Central Location']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 10 },
    { name: 'Roque del Conde', location: 'Adeje, Tenerife', description: 'Spacious two-bedroom apartment in Adeje with satellite TV and in-unit washing machine. Great for longer stays.', bedrooms: 2, bathrooms: 2, amenities: JSON.stringify(['Satellite TV', 'Washing Machine', 'Air Conditioning', 'WiFi', 'Parking']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 11 },
    { name: 'Golden Mile View', location: 'Las Americas, Tenerife', description: 'Garden view apartment 5 minutes walk to Playa de Troya. Relaxed, bright, and ideally positioned.', bedrooms: 1, bathrooms: 1, amenities: JSON.stringify(['Garden View', '5min to Playa de Troya', 'Air Conditioning', 'WiFi']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 12 },
    { name: 'Surf & Sky', location: 'Las Americas, Tenerife', description: 'Beachfront apartment with outdoor pool access. Surf, swim, and unwind — this one has it all.', bedrooms: 1, bathrooms: 1, amenities: JSON.stringify(['Beachfront', 'Outdoor Pool', 'Air Conditioning', 'WiFi']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 13 },
    { name: 'Blue You Away', location: 'Las Americas, Tenerife', description: 'Right on the beach with pool access — this apartment will genuinely blow you away.', bedrooms: 1, bathrooms: 1, amenities: JSON.stringify(['Beachfront', 'Outdoor Pool', 'Air Conditioning', 'WiFi']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 14 },
    { name: 'Palm Breeze', location: 'Las Americas, Tenerife', description: 'Spacious two-bedroom beachfront apartment with outdoor pool. Families and groups love this one.', bedrooms: 2, bathrooms: 1, amenities: JSON.stringify(['Beachfront', 'Outdoor Pool', 'Air Conditioning', 'WiFi', 'Spacious']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 15 },
    { name: 'Pulse View', location: 'Las Americas, Tenerife', description: 'Sea views and outdoor pool — this lively apartment keeps you in the heart of the action.', bedrooms: 1, bathrooms: 1, amenities: JSON.stringify(['Sea Views', 'Outdoor Pool', 'Air Conditioning', 'WiFi']), airbnb_url: '', booking_url: '', holidayfuture_url: bookingBase, photos: '[]', cover_photo: '', sort_order: 16 },
  ];

  const insertMany = db.transaction((apts: typeof apartments) => {
    for (const a of apts) insert.run(a);
  });
  insertMany(apartments);

  // Seed default page content
  const upsertContent = db.prepare(`
    INSERT OR IGNORE INTO page_content (page, key, value) VALUES (?, ?, ?)
  `);

  const contents = [
    ['about', 'headline', 'Your Home Away from Home in Paradise'],
    ['about', 'body', '<p>Sayzora Hospitality curates a collection of hand-picked apartments across Tenerife\'s most sought-after coastal areas. Each property is fully equipped, professionally managed, and designed to make you feel at home from day one.</p><p>Whether you\'re seeking a sun-soaked beachfront escape or a tranquil retreat with mountain and ocean views, our portfolio has the perfect space for you.</p>'],
    ['about', 'years_active', '5'],
    ['about', 'num_properties', '16+'],
    ['about', 'guest_rating', '4.9★'],
    ['collaborate', 'headline', 'Partner With Sayzora'],
    ['collaborate', 'body', '<p>We offer a range of partnership models — from full property management to flexible co-hosting arrangements. Let\'s grow together in Tenerife\'s thriving short-term rental market.</p>'],
    ['invest', 'headline', 'Invest in Tenerife Short-Term Rentals'],
    ['invest', 'body', '<p>Tenerife attracts over 6 million tourists annually with year-round sunshine. Our managed investment model lets you own property while we handle everything else — bookings, guests, maintenance.</p>'],
  ];

  const seedContent = db.transaction(() => {
    for (const [page, key, value] of contents) upsertContent.run(page, key, value);
  });
  seedContent();

  // Seed default settings
  const upsertSetting = db.prepare(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`);
  const settingsData = [
    ['contact_email', 'contact@sayzora.com'],
    ['instagram_url', ''],
    ['facebook_url', ''],
    ['whatsapp_number', ''],
  ];
  const seedSettings = db.transaction(() => {
    for (const [k, v] of settingsData) upsertSetting.run(k, v);
  });
  seedSettings();
}
