"use client";
import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";
import { parseApartment } from "@/lib/utils";
import type { Apartment, ApartmentParsed } from "@/types";
import ApartmentForm from "@/components/ApartmentForm";

export default function AdminApartments() {
  const [apts, setApts] = useState<ApartmentParsed[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ApartmentParsed | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/apartments");
    const data: Apartment[] = await res.json();
    setApts(data.map(parseApartment));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function deleteApt(id: number) {
    if (!confirm("Delete this apartment?")) return;
    await fetch(`/api/admin/apartments/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleActive(apt: ApartmentParsed) {
    await fetch(`/api/admin/apartments/${apt.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: apt.active ? 0 : 1 }),
    });
    load();
  }

  if (editing || creating) {
    return (
      <AdminShell>
        <div className="p-8 max-w-3xl">
          <button
            onClick={() => {
              setEditing(null);
              setCreating(false);
            }}
            className="text-navy/60 hover:text-navy text-sm mb-6 flex items-center gap-1"
          >
            ← Back to Apartments
          </button>
          <h1 className="text-2xl font-bold text-navy mb-6">{creating ? "New Apartment" : "Edit Apartment"}</h1>
          <ApartmentForm
            initial={editing ?? undefined}
            onSave={() => {
              setEditing(null);
              setCreating(false);
              load();
            }}
          />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-navy">Apartments</h1>
          <button onClick={() => setCreating(true)} className="btn btn-primary btn-sm">
            + New Apartment
          </button>
        </div>

        {loading ? (
          <p className="text-navy/40">Loading…</p>
        ) : (
          <div className="bg-white rounded-2xl border border-blue/10 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-blue/10">
                <tr>
                  {["#", "Name", "Location", "BR", "BA", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-navy/60 font-semibold text-xs uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {apts.map((apt, i) => (
                  <tr key={apt.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="px-4 py-3 text-navy/40">{i + 1}</td>
                    <td className="px-4 py-3 font-medium text-navy">{apt.name}</td>
                    <td className="px-4 py-3 text-navy/60">{apt.location.split(",")[0]}</td>
                    <td className="px-4 py-3 text-navy/60">{apt.bedrooms}</td>
                    <td className="px-4 py-3 text-navy/60">{apt.bathrooms}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActive(apt)} className={`px-2 py-0.5 rounded-full text-xs font-semibold ${apt.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                        {apt.active ? "Active" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3 flex gap-2">
                      <button onClick={() => setEditing(apt)} className="btn btn-ghost btn-sm text-xs border border-blue/20">
                        Edit
                      </button>
                      <button onClick={() => deleteApt(apt.id)} className="btn btn-danger btn-sm text-xs">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {apts.length === 0 && <p className="text-center text-navy/40 py-8">No apartments yet. Add your first one!</p>}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
