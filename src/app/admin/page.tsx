import { getDb } from '@/lib/db';
import AdminShell from '@/components/AdminShell';
import Link from 'next/link';

export default function AdminDashboard() {
  let aptCount = 0, msgCount = 0;
  try {
    const db = getDb();
    aptCount = (db.prepare('SELECT COUNT(*) as c FROM apartments').get() as { c: number }).c;
    msgCount = (db.prepare('SELECT COUNT(*) as c FROM contact_submissions').get() as { c: number }).c;
  } catch { /* */ }

  return (
    <AdminShell>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-navy mb-2">Dashboard</h1>
        <p className="text-navy/50 mb-8">Welcome back. Manage your Sayzora content here.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Apartments', value: aptCount, href: '/admin/apartments', icon: '🏠' },
            { label: 'Contact Messages', value: msgCount, href: '#', icon: '✉️' },
            { label: 'View Public Site', value: '→', href: '/', icon: '🌐' },
            { label: 'Booking Engine', value: '→', href: process.env.NEXT_PUBLIC_BOOKING_URL || 'https://126222_1.holidayfuture.com/', icon: '📅' },
          ].map(s => (
            <Link key={s.label} href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined}
              className="bg-white rounded-2xl p-5 border border-blue/10 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-2xl">{s.icon}</span>
              <p className="text-2xl font-bold text-navy mt-2">{s.value}</p>
              <p className="text-navy/50 text-sm">{s.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: 'Manage Apartments', desc: 'Add, edit, delete apartment listings with photos and booking links.', href: '/admin/apartments', icon: '🏠' },
            { title: 'Edit Page Content', desc: 'Update About Us, Collaborate, and Invest page text.', href: '/admin/content', icon: '📝' },
            { title: 'Site Settings', desc: 'Update contact email and social media links.', href: '/admin/settings', icon: '⚙️' },
          ].map(c => (
            <Link key={c.title} href={c.href}
              className="bg-white rounded-2xl p-6 border border-blue/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <span className="text-3xl">{c.icon}</span>
              <h3 className="font-bold text-navy mt-3 mb-1">{c.title}</h3>
              <p className="text-navy/55 text-sm">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminShell>
  );
}
