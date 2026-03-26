/**
 * Sayzora data store — zero database.
 *
 * Read:  Edge Config (if EDGE_CONFIG env set) → local JSON fallback
 * Write: Vercel REST API (if EDGE_CONFIG set)  → local JSON file (dev only)
 *
 * Edge Config keys:
 *   sayzora_settings          → Record<string, string>
 *   sayzora_content_about     → Record<string, string>
 *   sayzora_content_collaborate
 *   sayzora_content_invest
 */

import settingsFallback from "@/lib/data/settings.json";
import contentFallback from "@/lib/data/content.json";
import listings_data from "@/lib/listings_data.json"; // For reference, not used in code
import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";
import { put } from "@vercel/blob";

// verify blob storage for duplucate content (e.g. articles) with same filename

const { url } = await put("articles/blob.txt", "Hello World!", { access: "private", allowOverwrite: true });

// ── types ─────────────────────────────────────────────────────────────────────

export type Settings = Record<string, string>;
export type PageContent = Record<string, string>;

// ── helpers ───────────────────────────────────────────────────────────────────

function useEdgeConfig(): boolean {
  return Boolean(process.env.EDGE_CONFIG);
}

async function ecRead<T>(key: string): Promise<T | undefined> {
  const { get } = await import("@vercel/edge-config");
  return get<T>(key);
}

async function ecWrite(items: Record<string, unknown>): Promise<void> {
  const token = process.env.VERCEL_ACCESS_TOKEN;
  const configId = process.env.EDGE_CONFIG_ID;
  if (!token || !configId) {
    throw new Error("Set VERCEL_ACCESS_TOKEN and EDGE_CONFIG_ID to write Edge Config");
  }
  const res = await fetch(`https://api.vercel.com/v1/edge-config/${configId}/items`, {
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
  });
  if (!res.ok) throw new Error(`Edge Config write failed: ${res.status} – ${await res.text()}`);
}

// ── Settings ──────────────────────────────────────────────────────────────────

const SETTINGS_KEY = "sayzora_settings";

export async function getSettings(): Promise<Settings> {
  if (useEdgeConfig()) {
    return (await ecRead<Settings>(SETTINGS_KEY)) ?? (settingsFallback as Settings);
  }
  return settingsFallback as Settings;
}

export async function saveSettings(updates: Settings): Promise<void> {
  const current = await getSettings();
  const merged = { ...current, ...updates };
  if (useEdgeConfig()) {
    await ecWrite({ [SETTINGS_KEY]: merged });
  } else {
    // Dev: write back to local JSON file
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.resolve(process.cwd(), "src/lib/data/settings.json");
    await fs.writeFile(filePath, JSON.stringify(merged, null, 2));
  }
}

// ── Page Content ──────────────────────────────────────────────────────────────

function contentEcKey(page: string) {
  return `sayzora_content_${page}`;
}

type ContentJson = Record<string, Record<string, string>>;

export async function getPageContent(page: string): Promise<PageContent> {
  if (useEdgeConfig()) {
    return (await ecRead<PageContent>(contentEcKey(page))) ?? (contentFallback as ContentJson)[page] ?? {};
  }
  return (contentFallback as ContentJson)[page] ?? {};
}

export async function savePageContent(page: string, key: string, value: string): Promise<void> {
  const current = await getPageContent(page);
  const updated = { ...current, [key]: value };
  if (useEdgeConfig()) {
    await ecWrite({ [contentEcKey(page)]: updated });
  } else {
    // Dev: write back to local JSON file
    const fs = await import("fs/promises");
    const path = await import("path");
    const filePath = path.resolve(process.cwd(), "src/lib/data/content.json");
    const all = { ...(contentFallback as ContentJson), [page]: updated };
    await fs.writeFile(filePath, JSON.stringify(all, null, 2));
  }
}
