import { getDb } from "@/lib/db";
import { parseApartment } from "@/lib/utils";
import type { Apartment } from "@/types";
import ApartmentCard from "@/components/ApartmentCard";

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "https://126222_1.holidayfuture.com/";

export const metadata = { title: "Apartments – Sayzora Hospitality" };

export default function ApartmentsPage() {
  let apartments: ReturnType<typeof parseApartment>[] = [];
  try {
    const db = getDb();
    const raw = db.prepare("SELECT * FROM apartments WHERE active=1 ORDER BY sort_order,id").all() as Apartment[];
    apartments = raw.map(parseApartment);
  } catch {
    /* empty */
  }

  const locations = [...new Set(apartments.map((a) => a.location.split(",")[0]))];

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-b from-navy to-ocean pt-32 pb-16 text-center px-4">
        <div className="section-label text-blue/60">Our Collection</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">All Apartments</h1>
        <p className="text-white/60 text-lg max-w-md mx-auto">{apartments.length} premium properties across Tenerife's finest coastal locations.</p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          {locations.map((l) => (
            <span key={l} className="bg-white/10 border border-white/20 text-white/80 text-xs font-medium px-4 py-1.5 rounded-full">
              {l}
            </span>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="bg-cream py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apt) => (
              <ApartmentCard key={apt.id} apt={apt} />
            ))}
          </div>
          {apartments.length === 0 && <p className="text-center text-navy/50 py-12">No apartments available right now.</p>}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-navy py-16 text-center px-6">
        <h2 className="text-3xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
        <p className="text-white/60 mb-8">Browse all available dates on our booking engine — real-time availability.</p>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">
          Open Booking Engine →
        </a>
      </div>
    </>
  );
}
