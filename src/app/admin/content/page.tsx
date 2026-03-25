"use client";
import { useState, useEffect } from "react";
import AdminShell from "@/components/AdminShell";

const PAGES = [
  { id: "about", label: "About Us" },
  { id: "collaborate", label: "Collaborate" },
  { id: "invest", label: "Invest With Us" },
];

const ABOUT_FIELDS = [
  { key: "headline", label: "Tagline", type: "text" },
  { key: "body", label: "Body HTML", type: "textarea" },
  { key: "years_active", label: "Years Active", type: "text" },
  { key: "num_properties", label: "Number of Properties", type: "text" },
  { key: "guest_rating", label: "Guest Rating", type: "text" },
];

const OTHER_FIELDS = [
  { key: "headline", label: "Page Headline", type: "text" },
  { key: "body", label: "Body HTML", type: "textarea" },
];

export default function AdminContent() {
  const [activePage, setActivePage] = useState("about");
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function load(page: string) {
    setLoading(true);
    const res = await fetch(`/api/admin/content?page=${page}`);
    const rows: { key: string; value: string }[] = await res.json();
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    setContent(map);
    setLoading(false);
  }

  useEffect(() => {
    load(activePage);
  }, [activePage]);

  async function save() {
    setSaving(true);
    const fields = activePage === "about" ? ABOUT_FIELDS : OTHER_FIELDS;
    await Promise.all(
      fields.map((f) =>
        fetch("/api/admin/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ page: activePage, key: f.key, value: content[f.key] || "" }),
        }),
      ),
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const fields = activePage === "about" ? ABOUT_FIELDS : OTHER_FIELDS;

  return (
    <AdminShell>
      <div className="p-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-navy mb-6">Page Content</h1>

        {/* Page tabs */}
        <div className="flex gap-2 mb-6">
          {PAGES.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePage(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activePage === p.id ? "bg-blue text-white" : "bg-white text-navy/60 border border-blue/20 hover:border-blue"}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-navy/40">Loading…</p>
        ) : (
          <div className="space-y-5 bg-white rounded-2xl border border-blue/10 p-6 shadow-sm">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="form-label">{f.label}</label>
                {f.type === "textarea" ? (
                  <textarea rows={8} className="form-input resize-y font-mono text-xs" value={content[f.key] || ""} onChange={(e) => setContent((c) => ({ ...c, [f.key]: e.target.value }))} />
                ) : (
                  <input type="text" className="form-input" value={content[f.key] || ""} onChange={(e) => setContent((c) => ({ ...c, [f.key]: e.target.value }))} />
                )}
              </div>
            ))}
            <p className="text-xs text-navy/40">Tip: Body field accepts HTML. Use &lt;p&gt;, &lt;b&gt;, &lt;ul&gt;/&lt;li&gt; etc.</p>
            <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
              {saving ? "Saving…" : saved ? "✓ Saved!" : "Save Changes"}
            </button>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
