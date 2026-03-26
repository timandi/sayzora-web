import Image from "next/image";
import listingsData from "@/lib/listings_data.json";
import type { ListingData } from "@/components/ApartmentCard";
import ApartmentCard from "@/components/ApartmentCard";
import ContactForm from "@/components/ContactForm";
import { getSettings, getPageContent } from "@/lib/store";

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "https://126222_1.holidayfuture.com/";

export default async function HomePage() {
  const listings = (listingsData as ListingData[]).slice(0, 6);
  const [settings, aboutContent] = await Promise.all([getSettings(), getPageContent("about")]);

  const headline    = aboutContent.headline    || "Your Home Away from Home in Paradise";
  const body        = aboutContent.body        || "";
  const yearsActive = aboutContent.years_active || "5";
  const numProps    = aboutContent.num_properties || "16+";
  const guestRating = aboutContent.guest_rating || "4.9★";
  const contactEmail = settings.contact_email  || "contact@sayzora.com";

  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 pt-16 pb-12 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80" alt="Tenerife ocean view" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-hero-gradient" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(51,116,183,0.18) 0%, transparent 70%)" }} />
        </div>
        <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm mb-6 tracking-wide">
          📍 Tenerife, Canary Islands
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tight max-w-4xl mb-5">
          Accommodation in Tenerife – <em className="not-italic text-gold">Where Comfort Meets the Ocean Breeze</em>
        </h1>
        <p className="text-lg md:text-xl text-white/70 max-w-xl mb-8 font-light">
          Premium short-term apartments in Las Americas &amp; Los Cristianos. Your home away from home in paradise.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">Book Direct →</a>
          <a href="#apartments" className="btn btn-outline btn-lg">Browse Apartments</a>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mt-10">
          {["Las Americas", "Los Cristianos", "Torres del Sol", "Adeje"].map((loc) => (
            <span key={loc} className="bg-white/10 border border-white/20 text-white/85 text-xs font-medium px-4 py-1.5 rounded-full backdrop-blur-sm">{loc}</span>
          ))}
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* STATS */}
      <div className="bg-navy py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {([[numProps,"Premium Apartments"],["4","Prime Locations"],["365","Days of Sun/Year"],[guestRating,"Guest Rating"]] as [string,string][]).map(([num, label]) => (
            <div key={label}>
              <p className="text-3xl font-bold text-gold tracking-tight">{num}</p>
              <p className="text-white/55 text-sm mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT */}
      <section id="about" className="py-20 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="section-label">Who We Are</div>
          <h2 className="section-title mb-2">Sayzora Hospitality</h2>
          <p className="section-sub mb-12">{headline}</p>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              {body
                ? <div className="tiptap-content text-navy/70 space-y-3" dangerouslySetInnerHTML={{ __html: body }} />
                : <><p className="text-navy/70 mb-4">Sayzora Hospitality curates a collection of hand-picked apartments across Tenerife's most sought-after coastal areas.</p><p className="text-navy/70 mb-4">Whether you're seeking a sun-soaked beachfront escape or a tranquil retreat with mountain and ocean views, our portfolio has the perfect space for you.</p></>
              }
              <div className="mt-8">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">Check Availability →</a>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
              <Image src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80" alt="Tenerife apartment" fill className="object-cover" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 mt-14 text-center">
            {([["🏠",numProps,"Apartments"],["⭐",guestRating,"Average Rating"],["📅",yearsActive+" years","Experience"]] as [string,string,string][]).map(([icon, val, label]) => (
              <div key={label} className="bg-white rounded-2xl p-6 shadow-sm border border-blue/8">
                <span className="text-3xl">{icon}</span>
                <p className="text-2xl font-bold text-navy mt-2">{val}</p>
                <p className="text-navy/55 text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APARTMENTS */}
      <section id="apartments" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <div className="section-label">Our Properties</div>
              <h2 className="section-title">Browse Apartments</h2>
            </div>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">View All &amp; Book →</a>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ApartmentCard key={listing.listingId} listing={listing} />
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="/apartments" className="btn btn-primary btn-lg">
              See All {(listingsData as ListingData[]).length} Apartments →
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="bg-gradient-to-r from-navy to-ocean py-20 text-center px-6">
        <p className="section-label text-gold/80">Ready?</p>
        <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">Escape to Paradise</h2>
        <p className="text-white/65 text-lg max-w-md mx-auto mb-8">Browse all available dates and apartments — instant confirmation, no hidden fees.</p>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">Book Now →</a>
      </div>

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-cream">
        <div className="max-w-5xl mx-auto px-6">
          <div className="section-label">Get In Touch</div>
          <h2 className="section-title mb-2">Contact Us</h2>
          <p className="section-sub mb-12">Questions about availability, partnerships, or investments?</p>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <ContactForm />
            <div>
              <p className="text-navy/65 mb-6">Our team is based in Tenerife and happy to assist with bookings, collaborations, or investment enquiries.</p>
              {([["✉️", contactEmail, `mailto:${contactEmail}`], ["📍","Playa de las Americas, Tenerife, Spain",null], ["🌐","Booking Engine",BOOKING_URL]] as [string,string,string|null][]).map(([icon, label, href]) => (
                <div key={label} className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-lg flex-shrink-0">{icon}</div>
                  {href
                    ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="text-blue hover:underline text-sm">{label}</a>
                    : <span className="text-navy/70 text-sm">{label}</span>
                  }
                </div>
              ))}
              <div className="mt-8">
                <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-md">Book Direct →</a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
