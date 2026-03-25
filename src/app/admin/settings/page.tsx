"use client";
import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";

const FIELDS = [
  { key: "contact_email", label: "Contact Email", type: "email", placeholder: "contact@sayzora.com" },
  { key: "whatsapp_number", label: "WhatsApp Number", type: "text", placeholder: "+34 600 000 000" },
  { key: "instagram_url", label: "Instagram URL", type: "url", placeholder: "https://instagram.com/sayzora" },
  { key: "facebook_url", label: "Facebook URL", type: "url", placeholder: "https://facebook.com/sayzora" },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <AdminShell>
      <div className="p-8 max-w-xl">
        <h1 className="text-2xl font-bold text-navy mb-6">Site Settings</h1>

        {loading ? (
          <p className="text-navy/40">Loading…</p>
        ) : (
          <form onSubmit={save} className="bg-white rounded-2xl border border-blue/10 p-6 shadow-sm space-y-5">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className="form-label">{f.label}</label>
                <input type={f.type} className="form-input" placeholder={f.placeholder} value={settings[f.key] || ""} onChange={(e) => setSettings((s) => ({ ...s, [f.key]: e.target.value }))} />
              </div>
            ))}
            <button type="submit" disabled={saving} className="btn btn-primary btn-md">
              {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Settings"}
            </button>
          </form>
        )}

        {/* Change password hint */}
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <p className="text-sm font-semibold text-amber-800 mb-1">🔑 Changing Admin Password</p>
          <p className="text-xs text-amber-700">
            Edit <code className="bg-amber-100 px-1 rounded">.env.local</code> and update <code className="bg-amber-100 px-1 rounded">ADMIN_USERNAME</code> and{" "}
            <code className="bg-amber-100 px-1 rounded">ADMIN_PASSWORD</code>, then restart the server.
          </p>
        </div>
      </div>
    </AdminShell>
  );
}
