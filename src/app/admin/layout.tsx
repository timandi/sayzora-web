import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin – Sayzora" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-slate-50 font-sans">{children}</div>;
}
