'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/apartments', label: 'Apartments', icon: '🏠' },
  { href: '/admin/content', label: 'Page Content', icon: '📝' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function signOut() {
    setSigningOut(true);
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 bg-navy text-white flex flex-col flex-shrink-0">
        <div className="p-5 border-b border-white/10">
          <Link href="/" target="_blank" className="text-xl font-bold">
            Sayzora<span className="text-gold">.</span>
          </Link>
          <p className="text-white/40 text-xs mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 p-3">
          {NAV.map(n => {
            const active = pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href));
            return (
              <Link key={n.href} href={n.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-colors ${
                  active ? 'bg-blue text-white' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}>
                <span>{n.icon}</span> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={signOut} disabled={signingOut}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 text-sm w-full transition-colors">
            <span>🚪</span> {signingOut ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
