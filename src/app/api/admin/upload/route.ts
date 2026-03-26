import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const { randomUUID } = await import("crypto");
    const filename = `sayzora/uploads/${randomUUID()}.${ext}`;

    if (process.env.PUBLIC_BLOB_READ_WRITE_TOKEN) {
      const { put } = await import("@vercel/blob");
      const buffer = Buffer.from(await file.arrayBuffer());
      const blob = await put(filename, buffer, {
        access: "public",
        allowOverwrite: true,
        token: process.env.PUBLIC_BLOB_READ_WRITE_TOKEN,
        contentType: file.type,
      });
      return NextResponse.json({ url: blob.url });
    } else {
      // Dev fallback: save to /public/uploads/
      const { writeFile, mkdir } = await import("fs/promises");
      const path = await import("path");
      const localFilename = `${randomUUID()}.${ext}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(path.join(uploadDir, localFilename), buffer);
      return NextResponse.json({ url: `/uploads/${localFilename}` });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
