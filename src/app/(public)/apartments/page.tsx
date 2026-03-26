import listingsData from "@/lib/listings_data.json";
import type { ListingData } from "@/components/ApartmentCard";
import ApartmentCard from "@/components/ApartmentCard";

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "https://126222_1.holidayfuture.com/";

export const metadata = { title: "Apartments – Sayzora Hospitality" };

export default function ApartmentsPage() {
  const listings = listingsData as ListingData[];
  const cities = [...new Set(listings.map((l) => l.location.city))];

  return (
    <>
      <div className="bg-gradient-to-b from-navy to-ocean pt-32 pb-16 text-center px-4">
        <div className="section-label text-blue/60">Our Collection</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">All Apartments</h1>
        <p className="text-white/60 text-lg max-w-md mx-auto">{listings.length} premium properties across Tenerife's finest coastal locations.</p>
        <div className="flex flex-wrap gap-3 justify-center mt-6">
          {cities.map((c) => (
            <span key={c} className="bg-white/10 border border-white/20 text-white/80 text-xs font-medium px-4 py-1.5 rounded-full">{c}</span>
          ))}
        </div>
      </div>

      <div className="bg-cream py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ApartmentCard key={listing.listingId} listing={listing} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-navy py-16 text-center px-6">
        <h2 className="text-3xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
        <p className="text-white/60 mb-8">Browse all available dates on our booking engine — real-time availability.</p>
        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">Open Booking Engine →</a>
      </div>
    </>
  );
}
