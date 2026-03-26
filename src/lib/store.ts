/**
 * Sayzora data store — zero database.
 *
 * Vercel Blob is the single source of truth for all data.
 * Reads fetch directly from Blob; writes always push to Blob.
 *
 * Blob paths:
 *   sayzora/settings.json
 *   sayzora/content.json
 *   sayzora/listings.json
 */

import { ListingData } from "@/types";

// ── types ─────────────────────────────────────────────────────────────────────

export type Settings = Record<string, string>;
export type PageContent = Record<string, string>;

// ── helpers ───────────────────────────────────────────────────────────────────

const BLOB_PATHS = {
  settings: "sayzora/settings.json",
  content: "sayzora/content.json",
  listings: "sayzora/listings.json",
} as const;

const token = () => process.env.PUBLIC_BLOB_READ_WRITE_TOKEN;

async function readBlob<T>(blobPath: string, empty: T): Promise<T> {
  if (!token()) return empty;
  try {
    const { head } = await import("@vercel/blob");
    const meta = await head(blobPath, { token: token() }).catch(() => null);
    // Not yet seeded → return empty default
    if (!meta) return empty;
    const res = await fetch(meta.url, { next: { revalidate: 0 } });
    if (!res.ok) return empty;
    return (await res.json()) as T;
  } catch {
    return empty;
  }
}

async function writeBlob(blobPath: string, data: unknown): Promise<void> {
  if (!token()) return;
  const { put } = await import("@vercel/blob");
  await put(blobPath, JSON.stringify(data, null, 2), {
    access: "public",
    allowOverwrite: true,
    token: token(),
    contentType: "application/json",
  });
}

// ── Settings ──────────────────────────────────────────────────────────────────

export async function getSettings(): Promise<Settings> {
  return readBlob<Settings>(BLOB_PATHS.settings, {});
}

export async function saveSettings(updates: Settings): Promise<void> {
  const current = await getSettings();
  await writeBlob(BLOB_PATHS.settings, { ...current, ...updates });
}

// ── Page Content ──────────────────────────────────────────────────────────────

type ContentJson = Record<string, Record<string, string>>;

export async function getPageContent(page: string): Promise<PageContent> {
  const all = await readBlob<ContentJson>(BLOB_PATHS.content, {});
  return all[page] ?? {};
}

export async function savePageContent(page: string, key: string, value: string): Promise<void> {
  const all = await readBlob<ContentJson>(BLOB_PATHS.content, {});
  const updated: ContentJson = { ...all, [page]: { ...(all[page] ?? {}), [key]: value } };
  await writeBlob(BLOB_PATHS.content, updated);
}

// ── Listings ──────────────────────────────────────────────────────────────────

export async function getListings(): Promise<ListingData[]> {
  return readBlob<ListingData[]>(BLOB_PATHS.listings, []);
}

export async function saveListing(listingId: number, updates: Partial<ListingData>): Promise<void> {
  const all = await getListings();
  const updated = all.map((l) =>
    l.listingId === listingId ? { ...l, ...updates } : l,
  );
  await writeBlob(BLOB_PATHS.listings, updated);
}
