import Link from 'next/link';

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || 'https://126222_1.holidayfuture.com/';

export default function Footer() {
  return (
    <footer className="bg-navy text-white/60 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <p className="text-white font-bold text-xl mb-2">Sayzora<span className="text-gold">.</span></p>
          <p className="leading-relaxed max-w-sm">Premium short-term rental apartments in Tenerife. Your home away from home in paradise.</p>
          <p className="mt-4">
            <a href="mailto:contact@sayzora.com" className="text-gold hover:text-yellow-400 transition-colors">
              contact@sayzora.com
            </a>
          </p>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Explore</p>
          <ul className="space-y-2">
            {[['/#about','About Us'],['/#apartments','Apartments'],['/collaborate','Collaborate'],['/invest','Invest With Us']].map(([href,label])=>(
              <li key={href}><Link href={href} className="hover:text-white transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Locations</p>
          <ul className="space-y-2">
            {['Las Americas','Los Cristianos','Torres del Sol','Adeje'].map(l=>(
              <li key={l}>{l}</li>
            ))}
          </ul>
          <div className="mt-6">
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
              className="btn btn-gold btn-sm">
              Book Direct →
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-6 py-4 max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <p>© {new Date().getFullYear()} Sayzora Hospitality. All rights reserved.</p>
        <p>Playa de las Americas, Tenerife, Spain</p>
      </div>
    </footer>
  );
}
