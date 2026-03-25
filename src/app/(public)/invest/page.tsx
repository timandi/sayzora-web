'use client';
import { useState } from 'react';

export default function InvestPage() {
  const [status, setStatus] = useState<'idle'|'loading'|'ok'|'error'>('idle');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, subject: 'Investment Opportunity' }),
    });
    setStatus(res.ok ? 'ok' : 'error');
    if (res.ok) (e.target as HTMLFormElement).reset();
  }

  const stats = [
    ['6M+', 'Tourists per year'],
    ['365', 'Days of sunshine'],
    ['8–12%', 'Avg. gross rental yield'],
    ['95%', 'Managed occupancy rate'],
  ];

  const steps = [
    { n: '01', title: 'You Invest', desc: 'Purchase a property in Tenerife — we can advise on the best areas and unit types.' },
    { n: '02', title: 'We Set Up', desc: 'We furnish, photograph, list, and configure your property for short-term rental success.' },
    { n: '03', title: 'We Manage', desc: 'Guests book. We handle arrivals, support, cleaning, and maintenance end-to-end.' },
    { n: '04', title: 'You Earn', desc: 'Monthly payouts with full transparency. Sit back and enjoy your passive income.' },
  ];

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-b from-navy to-ocean pt-32 pb-20 text-center px-4">
        <div className="section-label text-blue/60">Investment Opportunity</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
          Invest in Tenerife<br />Short-Term Rentals
        </h1>
        <p className="text-white/65 text-lg max-w-2xl mx-auto">
          Tenerife's year-round tourism economy offers strong yields and high occupancy. We own nothing — you do. We manage everything.
        </p>
      </div>

      {/* Stats */}
      <div className="bg-navy py-12 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(([num, label]) => (
            <div key={label}>
              <p className="text-3xl font-bold text-gold">{num}</p>
              <p className="text-white/55 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Why Tenerife */}
      <section className="py-20 bg-cream px-6">
        <div className="max-w-5xl mx-auto">
          <div className="section-label">Why Tenerife</div>
          <h2 className="section-title mb-10">Europe's Year-Round Destination</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '☀️', title: 'Year-Round Tourism', desc: 'Unlike seasonal European destinations, Tenerife draws visitors every month of the year.' },
              { icon: '📈', title: 'Strong ROI', desc: 'Short-term rentals in Las Americas can yield 8–12% gross annually, outperforming long-term lets.' },
              { icon: '🏗️', title: 'Stable Market', desc: "Spain's stable legal framework and Canary Islands tax advantages make property ownership straightforward." },
            ].map(c => (
              <div key={c.title} className="bg-white rounded-2xl p-7 border border-blue/10 shadow-sm">
                <span className="text-3xl">{c.icon}</span>
                <h3 className="text-lg font-bold text-navy mt-3 mb-2">{c.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-5xl mx-auto">
          <div className="section-label">The Process</div>
          <h2 className="section-title mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map(s => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 rounded-full bg-blue/10 text-blue font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {s.n}
                </div>
                <h3 className="font-bold text-navy mb-2">{s.title}</h3>
                <p className="text-navy/55 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead capture form */}
      <section className="py-20 bg-gradient-to-br from-navy to-ocean px-6">
        <div className="max-w-xl mx-auto">
          <div className="section-label text-gold/70">Get Started</div>
          <h2 className="text-3xl font-bold text-white mb-2">Interested in Investing?</h2>
          <p className="text-white/60 mb-8">Leave your details and we'll get back to you within 24 hours.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-1.5">Name</label>
                <input name="first_name" type="text" required placeholder="Your name"
                  className="form-input bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-gold" />
              </div>
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-1.5">Phone</label>
                <input name="last_name" type="tel" placeholder="+34 …"
                  className="form-input bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-gold" />
              </div>
            </div>
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-1.5">Email</label>
              <input name="email" type="email" required placeholder="you@example.com"
                className="form-input bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-gold" />
            </div>
            <div>
              <label className="block text-white/80 text-sm font-semibold mb-1.5">Investment Range</label>
              <select name="message"
                className="form-input bg-white/10 border-white/20 text-white focus:border-gold">
                <option value="Under €150,000" className="text-navy">Under €150,000</option>
                <option value="€150,000 – €250,000" className="text-navy">€150,000 – €250,000</option>
                <option value="€250,000 – €500,000" className="text-navy">€250,000 – €500,000</option>
                <option value="€500,000+" className="text-navy">€500,000+</option>
              </select>
            </div>
            <button type="submit" disabled={status==='loading'}
              className={`btn btn-gold btn-md w-full ${status==='loading'?'opacity-70':''}`}>
              {status==='loading' ? 'Sending…' : status==='ok' ? '✓ We\'ll be in touch!' : 'Request Investment Info →'}
            </button>
            {status==='error' && <p className="text-red-400 text-sm text-center">Something went wrong. Please try again.</p>}
          </form>
        </div>
      </section>
    </>
  );
}
