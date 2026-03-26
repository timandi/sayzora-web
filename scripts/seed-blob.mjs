/**
 * One-time script: upload local JSON files to Vercel Blob.
 *
 * Run AFTER creating a Blob store and pulling the token:
 *   vercel env pull .env.local
 *   node scripts/seed-blob.mjs
 *
 * Safe to re-run — uses allowOverwrite: true.
 * Skips any file that already has data in Blob (unless you pass --force).
 */

import { put, head } from "@vercel/blob";
import { readFile } from "fs/promises";
import { resolve } from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

const token = process.env.PUBLIC_BLOB_READ_WRITE_TOKEN;
if (!token) {
  console.error("❌  PUBLIC_BLOB_READ_WRITE_TOKEN not set. Run: vercel env pull .env.local");
  process.exit(1);
}

const force = process.argv.includes("--force");

const FILES = [
  { local: "src/lib/data/settings.json", blob: "sayzora/settings.json" },
  { local: "src/lib/data/content.json", blob: "sayzora/content.json" },
  { local: "src/lib/listings_data.json", blob: "sayzora/listings.json" },
];

for (const { local, blob } of FILES) {
  // Check if already exists in Blob
  if (!force) {
    const existing = await head(blob, { token }).catch(() => null);
    if (existing) {
      console.log(`⏭  ${blob} — already in Blob, skipping (use --force to overwrite)`);
      continue;
    }
  }

  const content = await readFile(resolve(local), "utf-8");
  // Validate JSON before uploading
  JSON.parse(content);

  const result = await put(blob, content, {
    access: "public",
    allowOverwrite: true,
    contentType: "application/json",
    token,
  });

  console.log(`✅  ${blob} → ${result.url}`);
}

console.log("\nDone. Your Blob store is seeded.");
