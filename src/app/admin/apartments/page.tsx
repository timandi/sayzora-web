"use client";
import { useState, useEffect, useRef } from "react";
import AdminShell from "@/components/AdminShell";
import type { ListingData, ListingPhoto } from "@/types";

// ── helpers ──────────────────────────────────────────────────────────────────

function PhotoThumbnail({ url, alt }: { url: string; alt: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className="w-14 h-10 object-cover rounded-lg border border-blue/10 flex-shrink-0" />
  );
}

// ── Edit Drawer ───────────────────────────────────────────────────────────────

interface DrawerProps {
  listing: ListingData;
  onClose: () => void;
  onSaved: (updated: ListingData) => void;
}

function EditDrawer({ listing, onClose, onSaved }: DrawerProps) {
  const [form, setForm] = useState<ListingData>({ ...listing });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof ListingData>(key: K, value: ListingData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/apartments/${listing.listingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      onSaved(form);
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }

  async function uploadPhoto(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      addPhotoUrl(data.url);
    } catch (e) {
      setError(String(e));
    } finally {
      setUploading(false);
    }
  }

  function addPhotoUrl(url: string) {
    if (!url.trim()) return;
    const maxOrder = form.photos.reduce((m, p) => Math.max(m, p.sortOrder), -1);
    const newPhoto: ListingPhoto = {
      id: Date.now(),
      url: url.trim(),
      caption: "",
      sortOrder: maxOrder + 1,
    };
    set("photos", [...form.photos, newPhoto]);
    setNewPhotoUrl("");
  }

  function removePhoto(id: number) {
    set("photos", form.photos.filter((p) => p.id !== id));
  }

  function movePhoto(id: number, dir: -1 | 1) {
    const sorted = [...form.photos].sort((a, b) => a.sortOrder - b.sortOrder);
    const idx = sorted.findIndex((p) => p.id === id);
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const newPhotos = sorted.map((p, i) => {
      if (i === idx) return { ...p, sortOrder: sorted[swapIdx].sortOrder };
      if (i === swapIdx) return { ...p, sortOrder: sorted[idx].sortOrder };
      return p;
    });
    set("photos", newPhotos);
  }

  const sortedPhotos = [...form.photos].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue/10">
          <div>
            <h2 className="font-bold text-navy text-lg">{listing.externalName}</h2>
            <p className="text-xs text-navy/40">ID {listing.listingId}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-blue/10 flex items-center justify-center text-navy/60 hover:text-navy transition-colors">
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Display name */}
          <div>
            <label className="form-label">Display Name</label>
            <input type="text" className="form-input" value={form.externalName} onChange={(e) => set("externalName", e.target.value)} />
          </div>

          {/* Summary */}
          <div>
            <label className="form-label">Airbnb Summary / Short Description</label>
            <textarea rows={3} className="form-input resize-y" value={form.airbnbSummary || ""} onChange={(e) => set("airbnbSummary", e.target.value)} />
          </div>

          {/* City */}
          <div>
            <label className="form-label">City</label>
            <input type="text" className="form-input" value={form.location.city} onChange={(e) => set("location", { ...form.location, city: e.target.value })} />
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="form-label">Bedrooms</label>
              <input type="number" min={0} className="form-input" value={form.bedroomsNumber} onChange={(e) => set("bedroomsNumber", Number(e.target.value))} />
            </div>
            <div>
              <label className="form-label">Bathrooms</label>
              <input type="number" min={0} step={0.5} className="form-input" value={form.bathroomsNumber} onChange={(e) => set("bathroomsNumber", Number(e.target.value))} />
            </div>
            <div>
              <label className="form-label">Guests</label>
              <input type="number" min={1} className="form-input" value={form.personCapacity} onChange={(e) => set("personCapacity", Number(e.target.value))} />
            </div>
          </div>

          {/* Booking URLs */}
          <div>
            <label className="form-label">HolidayFuture URL</label>
            <input type="url" className="form-input font-mono text-xs" value={form.holidayfutureUrl || ""} onChange={(e) => set("holidayfutureUrl", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Airbnb URL</label>
            <input type="url" className="form-input font-mono text-xs" value={form.airbnbUrl || ""} onChange={(e) => set("airbnbUrl", e.target.value)} />
          </div>
          <div>
            <label className="form-label">Booking.com URL</label>
            <input type="url" className="form-input font-mono text-xs" value={form.bookingUrl || ""} onChange={(e) => set("bookingUrl", e.target.value)} />
          </div>

          {/* Photos */}
          <div>
            <label className="form-label">Photos ({form.photos.length})</label>
            <div className="space-y-2 mb-3 max-h-64 overflow-y-auto pr-1">
              {sortedPhotos.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2 bg-blue/5 rounded-xl p-2">
                  <PhotoThumbnail url={p.url} alt={`photo ${i + 1}`} />
                  <span className="text-xs text-navy/50 flex-1 truncate font-mono">{p.url}</span>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => movePhoto(p.id, -1)} disabled={i === 0} className="w-6 h-6 rounded-lg bg-white border border-blue/20 text-navy/60 hover:text-navy disabled:opacity-30 flex items-center justify-center text-xs">↑</button>
                    <button onClick={() => movePhoto(p.id, 1)} disabled={i === sortedPhotos.length - 1} className="w-6 h-6 rounded-lg bg-white border border-blue/20 text-navy/60 hover:text-navy disabled:opacity-30 flex items-center justify-center text-xs">↓</button>
                    <button onClick={() => removePhoto(p.id)} className="w-6 h-6 rounded-lg bg-red-50 border border-red-200 text-red-400 hover:text-red-600 hover:bg-red-100 flex items-center justify-center text-xs">✕</button>
                  </div>
                </div>
              ))}
              {form.photos.length === 0 && <p className="text-xs text-navy/40 py-2">No photos yet.</p>}
            </div>

            {/* Add by URL */}
            <div className="flex gap-2">
              <input
                type="url"
                className="form-input flex-1 font-mono text-xs"
                placeholder="https://... paste photo URL"
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addPhotoUrl(newPhotoUrl); } }}
              />
              <button onClick={() => addPhotoUrl(newPhotoUrl)} className="btn btn-ghost btn-sm border border-blue/20 whitespace-nowrap">Add URL</button>
            </div>

            {/* Upload file */}
            <div className="mt-2">
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPhoto(f); e.target.value = ""; }} />
              <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn btn-ghost btn-sm border border-blue/20 w-full">
                {uploading ? "Uploading…" : "⬆ Upload Photo"}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-blue/10 bg-white">
          <button onClick={save} disabled={saving} className="btn btn-primary btn-md w-full">
            {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminApartments() {
  const [listings, setListings] = useState<ListingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ListingData | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/apartments")
      .then((r) => r.json())
      .then((data) => {
        setListings(data);
        setLoading(false);
      });
  }, []);

  function handleSaved(updated: ListingData) {
    setListings((all) => all.map((l) => (l.listingId === updated.listingId ? updated : l)));
    // keep drawer open so user can keep editing
  }

  const filtered = listings.filter(
    (l) =>
      l.externalName.toLowerCase().includes(search.toLowerCase()) ||
      l.location.city.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminShell>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-navy">Apartments</h1>
            <p className="text-navy/50 text-sm mt-0.5">{listings.length} listings</p>
          </div>
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input w-48 text-sm"
          />
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-16 rounded-2xl bg-blue/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-blue/10 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-blue/10 text-left">
                  <th className="px-4 py-3 text-navy/50 font-semibold">Photo</th>
                  <th className="px-4 py-3 text-navy/50 font-semibold">Name</th>
                  <th className="px-4 py-3 text-navy/50 font-semibold hidden md:table-cell">City</th>
                  <th className="px-4 py-3 text-navy/50 font-semibold hidden md:table-cell">BR / BA / Guests</th>
                  <th className="px-4 py-3 text-navy/50 font-semibold hidden lg:table-cell">Photos</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((listing, i) => {
                  const cover = [...listing.photos].sort((a, b) => a.sortOrder - b.sortOrder)[0];
                  return (
                    <tr
                      key={listing.listingId}
                      className={`border-b border-blue/5 last:border-0 hover:bg-blue/3 transition-colors ${i % 2 === 0 ? "" : "bg-blue/[0.02]"}`}
                    >
                      <td className="px-4 py-3">
                        {cover ? (
                          <PhotoThumbnail url={cover.url} alt={listing.externalName} />
                        ) : (
                          <div className="w-14 h-10 rounded-lg bg-blue/10 flex items-center justify-center text-xl">🏖️</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-navy">{listing.externalName}</p>
                        <p className="text-xs text-navy/40">ID {listing.listingId}</p>
                      </td>
                      <td className="px-4 py-3 text-navy/60 hidden md:table-cell">{listing.location.city}</td>
                      <td className="px-4 py-3 text-navy/60 hidden md:table-cell">
                        {listing.bedroomsNumber} Bedrooms · {listing.bathroomsNumber} Bathrooms · {listing.personCapacity} Guests
                      </td>
                      <td className="px-4 py-3 text-navy/60 hidden lg:table-cell">{listing.photos.length}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setEditing(listing)}
                          className="btn btn-ghost btn-sm border border-blue/20 text-xs"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-navy/40">No listings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <EditDrawer
          listing={editing}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}
    </AdminShell>
  );
}
