/**
 * Edge Config persistence layer for Sayzora.
 *
 * Reads  → @vercel/edge-config SDK (ultra-fast, runs at the edge)
 * Writes → Vercel REST API PATCH /v1/edge-config/{id}/items
 *
 * Falls back to SQLite (dev / no Edge Config configured).
 */

import type { EdgeConfigValue } from "@vercel/edge-config";

// ── helpers ──────────────────────────────────────────────────────────────────

function isEdgeConfigured(): boolean {
  return Boolean(process.env.EDGE_CONFIG);
}

// Reads one key from Edge Config SDK
async function ecGet<T>(key: string): Promise<T | undefined> {
  const { get } = await import("@vercel/edge-config");
  return get<T>(key);
}

// Reads all keys (optionally filtered)
async function ecGetAll<T extends Record<string, EdgeConfigValue>>(
  keys?: string[]
): Promise<T> {
  const { getAll } = await import("@vercel/edge-config");
  return getAll<T>(keys as (keyof T)[]);
}

// Writes items via Vercel REST API
async function ecSet(items: Record<string, EdgeConfigValue>): Promise<void> {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  const configId = process.env.EDGE_CONFIG_ID;
  if (!token || !configId) {
    throw new Error(
      "VERCEL_ACCESS_TOKEN and EDGE_CONFIG_ID must be set to write Edge Config"
    );
  }
  const res = await fetch(
    `https://api.vercel.com/v1/edge-config/${configId}/items`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: Object.entries(items).map(([key, value]) => ({
          operation: "upsert",
          key,
          value,
        })),
      }),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Edge Config write failed: ${res.status} – ${err}`);
  }
}

// ── Settings ─────────────────────────────────────────────────────────────────

const SETTINGS_KEY = "sayzora_settings";

const DEFAULT_SETTINGS: Record<string, string> = {
  contact_email: "contact@sayzora.com",
  instagram_url: "",
  facebook_url: "",
  whatsapp_number: "",
};

export async function getSettings(): Promise<Record<string, string>> {
  if (isEdgeConfigured()) {
    const data = await ecGet<Record<string, string>>(SETTINGS_KEY);
    return data ?? DEFAULT_SETTINGS;
  }
  // SQLite fallback
  const { getDb } = await import("@/lib/db");
  const db = getDb();
  const rows = db
    .prepare("SELECT key, value FROM settings")
    .all() as { key: string; value: string }[];
  return rows.length
    ? Object.fromEntries(rows.map((r) => [r.key, r.value]))
    : DEFAULT_SETTINGS;
}

export async function saveSettings(
  updates: Record<string, string>
): Promise<void> {
  if (isEdgeConfigured()) {
    const current = await getSettings();
    const merged = { ...current, ...updates };
    await ecSet({ [SETTINGS_KEY]: merged });
    return;
  }
  // SQLite fallback
  const { getDb } = await import("@/lib/db");
  const db = getDb();
  const upsert = db.prepare(`
    INSERT INTO settings (key, value) VALUES (?, ?)
    ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=datetime('now')
  `);
  const tx = db.transaction(() => {
    for (const [k, v] of Object.entries(updates)) upsert.run(k, v);
  });
  tx();
}

// ── Page Content ─────────────────────────────────────────────────────────────

// Stored as one Edge Config key per page: "sayzora_content_about", etc.
function contentKey(page: string) {
  return `sayzora_content_${page}`;
}

const DEFAULT_CONTENT: Record<string, Record<string, string>> = {
  about: {
    headline: "Your Home Away from Home in Paradise",
    body: "<p>Sayzora Hospitality curates a collection of hand-picked apartments across Tenerife's most sought-after coastal areas. Each property is fully equipped, professionally managed, and designed to make you feel at home from day one.</p><p>Whether you're seeking a sun-soaked beachfront escape or a tranquil retreat with mountain and ocean views, our portfolio has the perfect space for you.</p>",
    years_active: "5",
    num_properties: "16+",
    guest_rating: "4.9★",
  },
  collaborate: {
    headline: "Partner With Sayzora",
    body: "<p>We offer a range of partnership models — from full property management to flexible co-hosting arrangements. Let's grow together in Tenerife's thriving short-term rental market.</p>",
  },
  invest: {
    headline: "Invest in Tenerife Short-Term Rentals",
    body: "<p>Tenerife attracts over 6 million tourists annually with year-round sunshine. Our managed investment model lets you own property while we handle everything else — bookings, guests, maintenance.</p>",
  },
};

export async function getPageContent(
  page: string
): Promise<Record<string, string>> {
  if (isEdgeConfigured()) {
    const data = await ecGet<Record<string, string>>(contentKey(page));
    return data ?? DEFAULT_CONTENT[page] ?? {};
  }
  // SQLite fallback
  const { getDb } = await import("@/lib/db");
  const db = getDb();
  const rows = db
    .prepare("SELECT key, value FROM page_content WHERE page = ?")
    .all(page) as { key: string; value: string }[];
  if (rows.length) return Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return DEFAULT_CONTENT[page] ?? {};
}

export async function savePageContent(
  page: string,
  key: string,
  value: string
): Promise<void> {
  if (isEdgeConfigured()) {
    const current = await getPageContent(page);
    const updated = { ...current, [key]: value };
    await ecSet({ [contentKey(page)]: updated });
    return;
  }
  // SQLite fallback
  const { getDb } = await import("@/lib/db");
  const db = getDb();
  db.prepare(`
    INSERT INTO page_content (page, key, value) VALUES (?, ?, ?)
    ON CONFLICT(page, key) DO UPDATE SET value=excluded.value, updated_at=datetime('now')
  `).run(page, key, value);
}
