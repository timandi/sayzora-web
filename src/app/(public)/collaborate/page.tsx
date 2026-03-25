import { getDb } from '@/lib/db';
import ContactForm from '@/components/ContactForm';

export const metadata = { title: 'Collaborate – Sayzora Hospitality' };

function getContent(key: string, fallback = '') {
  try {
    const db = getDb();
    const row = db.prepare('SELECT value FROM page_content WHERE page=? AND key=?').get('collaborate', key) as { value: string } | undefined;
    return row?.value ?? fallback;
  } catch { return fallback; }
}

export default function CollaboratePage() {
  const headline = getContent('headline', 'Partner With Sayzora');
  const body = getContent('body', '');

  const offerings = [
    { icon: '🏢', title: 'Full Property Management', desc: 'We handle everything: listings, guests, cleaning, maintenance. You collect your returns.' },
    { icon: '🤝', title: 'Co-Hosting', desc: 'Already listed on Airbnb or Booking.com? We amplify your revenue and handle guest operations.' },
    { icon: '🧹', title: 'Cleaning & Maintenance', desc: 'Professional turnover service, linen supply, and preventive maintenance for your property.' },
    { icon: '📸', title: 'Listing Optimization', desc: 'Professional photography, pricing strategy, and listing copy to maximize your occupancy rate.' },
  ];

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-b from-navy to-ocean pt-32 pb-20 text-center px-4">
        <div className="section-label text-blue/60">Work Together</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">{headline}</h1>
        {body && (
          <div className="text-white/65 text-lg max-w-2xl mx-auto tiptap-content" dangerouslySetInnerHTML={{ __html: body }} />
        )}
        {!body && (
          <p className="text-white/65 text-lg max-w-2xl mx-auto">
            We offer a range of partnership models — from full property management to flexible co-hosting. Let's grow together in Tenerife's thriving rental market.
          </p>
        )}
      </div>

      {/* Offerings */}
      <section className="py-20 bg-cream px-6">
        <div className="max-w-5xl mx-auto">
          <div className="section-label">What We Offer</div>
          <h2 className="section-title mb-10">Partnership Models</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {offerings.map(o => (
              <div key={o.title} className="bg-white rounded-2xl p-7 border border-blue/10 shadow-sm">
                <span className="text-3xl">{o.icon}</span>
                <h3 className="text-lg font-bold text-navy mt-3 mb-2">{o.title}</h3>
                <p className="text-navy/60 text-sm leading-relaxed">{o.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Sayzora */}
      <section className="py-20 bg-white px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="section-label">Why Choose Us</div>
            <h2 className="section-title mb-4">Local Expertise, Premium Results</h2>
            <ul className="space-y-3 text-navy/70">
              {[
                'Deep local knowledge of Tenerife's rental market',
                'Established presence on Airbnb, Booking.com & HolidayFuture',
                'Dedicated guest support team available 7 days a week',
                'Transparent reporting and monthly owner payouts',
                'Proven track record of 4.9★ guest satisfaction',
              ].map(i => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-gold mt-0.5">✓</span> {i}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-cream rounded-2xl p-8 text-center">
            <p className="text-5xl font-extrabold text-navy mb-2">95%</p>
            <p className="text-navy/55">Average occupancy rate across managed properties</p>
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-20 bg-cream px-6">
        <div className="max-w-2xl mx-auto">
          <div className="section-label">Get In Touch</div>
          <h2 className="section-title mb-2">Start a Conversation</h2>
          <p className="section-sub mb-10">Tell us about your property and how you'd like to collaborate.</p>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
