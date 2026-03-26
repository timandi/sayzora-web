"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "https://126222_1.holidayfuture.com/";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-navy/95 backdrop-blur-md shadow-2xl" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-gold font-bold text-3xl tracking-tight">
          Sayzora<span className="text-gold">.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-6">
          {[
            ["/#about", "About"],
            ["/#apartments", "Apartments"],
            ["/collaborate", "Collaborate"],
            ["/invest", "Invest"],
          ].map(([href, label]) => (
            <li key={href}>
              <Link href={href} className="text-gold hover:text-gold text-m font-bold transition-colors">
                {label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/#contact" className="text-gold hover:text-gold text-m font-bold transition-colors">
              Contact
            </Link>
          </li>
          <li>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
              Book Now
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button className="md:hidden text-gold p-2 rounded-lg hover:bg-white/10" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-navy/98 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-3">
          {[
            ["/#about", "About"],
            ["/#apartments", "Apartments"],
            ["/collaborate", "Collaborate"],
            ["/invest", "Invest"],
            ["/#contact", "Contact"],
          ].map(([href, label]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="block text-gold/80 hover:text-gold py-2 text-m font-bold">
              {label}
            </Link>
          ))}
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm w-full">
            Book Now
          </a>
        </div>
      )}
    </nav>
  );
}
