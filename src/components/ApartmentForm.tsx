"use client";
import { useState } from "react";
import type { ApartmentParsed } from "@/types";

const AMENITY_OPTIONS = [
  "Sea Views",
  "Beachfront",
  "Pool",
  "Outdoor Pool",
  "Private Pool",
  "Air Conditioning",
  "WiFi",
  "Balcony",
  "Terrace",
  "Garden",
  "Mountain View",
  "Teide View",
  "Atlantic View",
  "Walk-in Shower",
  "Washing Machine",
  "Satellite TV",
  "Streaming TV",
  "Parking",
  "Disabled Access",
  "Kids Pool",
  "Private Beach Area",
  "Private Entrance",
  "Bidet",
];

interface Props {
  initial?: ApartmentParsed;
  onSave: () => void;
}

export default function ApartmentForm({ initial, onSave }: Props) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    location: initial?.location || "Las Americas, Tenerife",
    description: initial?.description || "",
    bedrooms: initial?.bedrooms || 1,
    bathrooms: initial?.bathrooms || 1,
    amenities: initial?.amenities || ([] as string[]),
    airbnb_url: initial?.airbnb_url || "",
    booking_url: initial?.booking_url || "",
    holidayfuture_url: initial?.holidayfuture_url || "",
    photos: initial?.photos || ([] as string[]),
    cover_photo: initial?.cover_photo || "",
    sort_order: initial?.sort_order || 0,
    active: initial?.active !== undefined ? initial.active : 1,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  function toggleAmenity(a: string) {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  }

  function addPhotoUrl() {
    if (!photoUrl.trim()) return;
    setForm((f) => ({ ...f, photos: [...f.photos, photoUrl.trim()], cover_photo: f.cover_photo || photoUrl.trim() }));
    setPhotoUrl("");
  }

  function removePhoto(url: string) {
    setForm((f) => ({
      ...f,
      photos: f.photos.filter((p) => p !== url),
      cover_photo: f.cover_photo === url ? f.photos.find((p) => p !== url) || "" : f.cover_photo,
    }));
  }

  async function uploadFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) {
      const { url } = await res.json();
      setForm((f) => ({ ...f, photos: [...f.photos, url], cover_photo: f.cover_photo || url }));
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const url = initial ? `/api/admin/apartments/${initial.id}` : "/api/admin/apartments";
    const method = initial ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      onSave();
    } else {
      setError("Failed to save. Please try again.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-2xl border border-blue/10 p-6 shadow-sm">
      {/* Basic */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="form-label">Name *</label>
          <input className="form-input" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
        </div>
        <div className="col-span-2">
          <label className="form-label">Location</label>
          <input className="form-input" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
        </div>
        <div>
          <label className="form-label">Bedrooms</label>
          <input type="number" min={1} max={10} className="form-input" value={form.bedrooms} onChange={(e) => setForm((f) => ({ ...f, bedrooms: +e.target.value }))} />
        </div>
        <div>
          <label className="form-label">Bathrooms</label>
          <input type="number" min={1} max={10} className="form-input" value={form.bathrooms} onChange={(e) => setForm((f) => ({ ...f, bathrooms: +e.target.value }))} />
        </div>
        <div>
          <label className="form-label">Sort Order</label>
          <input type="number" min={0} className="form-input" value={form.sort_order} onChange={(e) => setForm((f) => ({ ...f, sort_order: +e.target.value }))} />
        </div>
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={!!form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked ? 1 : 0 }))} className="w-4 h-4 rounded" />
            <span className="text-sm font-semibold text-navy">Active (visible on site)</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="form-label">Description</label>
        <textarea rows={3} className="form-input resize-none" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
      </div>

      {/* Amenities */}
      <div>
        <label className="form-label">Amenities</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {AMENITY_OPTIONS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => toggleAmenity(a)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${form.amenities.includes(a) ? "bg-blue text-white border-blue" : "bg-white text-navy/60 border-blue/20 hover:border-blue"}`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Booking links */}
      <div className="space-y-3">
        <label className="form-label">Booking Links</label>
        {[
          ["HolidayFuture URL", "holidayfuture_url"],
          ["Airbnb URL", "airbnb_url"],
          ["Booking.com URL", "booking_url"],
        ].map(([label, key]) => (
          <div key={key}>
            <label className="text-xs text-navy/50 mb-1 block">{label}</label>
            <input type="url" className="form-input" placeholder="https://…" value={(form as Record<string, unknown>)[key] as string} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} />
          </div>
        ))}
      </div>

      {/* Photos */}
      <div>
        <label className="form-label">Photos</label>
        <div className="flex gap-2 mt-1">
          <input className="form-input flex-1" placeholder="Paste image URL…" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
          <button type="button" onClick={addPhotoUrl} className="btn btn-ghost btn-sm border border-blue/20">
            Add URL
          </button>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <label className="btn btn-ghost btn-sm border border-blue/20 cursor-pointer">
            {uploading ? "Uploading…" : "📁 Upload File"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) uploadFile(e.target.files[0]);
              }}
            />
          </label>
        </div>
        {form.photos.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {form.photos.map((p) => (
              <div key={p} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                  <button type="button" onClick={() => setForm((f) => ({ ...f, cover_photo: p }))} className={`text-xs px-1.5 py-0.5 rounded ${form.cover_photo === p ? "bg-gold text-navy" : "bg-white/80 text-navy"}`}>
                    {form.cover_photo === p ? "★ Cover" : "Cover"}
                  </button>
                  <button type="button" onClick={() => removePhoto(p)} className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="btn btn-primary btn-md flex-1">
          {saving ? "Saving…" : initial ? "Update Apartment" : "Create Apartment"}
        </button>
      </div>
    </form>
  );
}
