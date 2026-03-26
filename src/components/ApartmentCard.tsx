"use client";

import Image from "next/image";
import { useState, useCallback } from "react";

export interface ListingPhoto {
  id: number;
  url: string;
  caption: string;
  sortOrder: number;
}

export interface ListingData {
  listingId: number;
  listingName: string;
  externalName: string;
  description: string;
  airbnbSummary?: string;
  personCapacity: number;
  bedroomsNumber: number;
  bedsNumber: number;
  bathroomsNumber: number;
  roomType: string;
  location: { city: string; state?: string; countryCode?: string; address?: string };
  amenities: { id: number; name: string; category: string; description: string | null }[];
  photos: ListingPhoto[];
  holidayfutureUrl?: string;
  airbnbUrl?: string;
  bookingUrl?: string;
}

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || "https://126222_1.holidayfuture.com/";
const HIGHLIGHT = ["Swimming pool","Air conditioning","WiFi","Parking","Beach essentials","TV","Washing machine","Sea view","Ocean view","Balcony"];
const DOT_MAX = 5;

export default function ApartmentCard({ listing }: { listing: ListingData }) {
  const photos = listing.photos
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((p) => p.url);

  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  const prev = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCurrent((c) => (c === 0 ? photos.length - 1 : c - 1));
  }, [photos.length]);

  const next = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setCurrent((c) => (c === photos.length - 1 ? 0 : c + 1));
  }, [photos.length]);

  const goTo = useCallback((e: React.MouseEvent, idx: number) => {
    e.preventDefault(); e.stopPropagation();
    setCurrent(idx);
  }, []);

  const highlightAmenities = listing.amenities
    .filter((a) => HIGHLIGHT.includes(a.name))
    .slice(0, 4)
    .map((a) => a.name);
  const extraAmenities = listing.amenities.length - highlightAmenities.length;

  const dotCount = Math.min(photos.length, DOT_MAX);
  const dotStep = photos.length > DOT_MAX ? Math.ceil(photos.length / DOT_MAX) : 1;

  return (
    <div className="card-base flex flex-col overflow-hidden group">
      {/* Carousel */}
      <div className="relative aspect-video bg-gradient-to-br from-blue/20 to-ocean/30 overflow-hidden select-none">
        {photos.length > 0 ? (
          <>
            {photos.map((url, i) => (
              <div
                key={i}
                className="absolute inset-0 transition-opacity duration-300"
                style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? "auto" : "none" }}
              >
                <Image
                  src={url}
                  alt={`${listing.externalName} – photo ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority={i === 0}
                  onLoad={() => setLoaded((p) => ({ ...p, [i]: true }))}
                />
                {!loaded[i] && <div className="absolute inset-0 bg-gradient-to-br from-blue/20 to-ocean/30 animate-pulse" />}
              </div>
            ))}

            {photos.length > 1 && (
              <>
                <button onClick={prev} aria-label="Previous photo" className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <button onClick={next} aria-label="Next photo" className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                  {Array.from({ length: dotCount }).map((_, i) => {
                    const photoIdx = i * dotStep;
                    const isActive = photos.length <= DOT_MAX ? i === current : Math.floor(current / dotStep) === i;
                    return (
                      <button key={i} onClick={(e) => goTo(e, photoIdx)} aria-label={`Go to photo ${photoIdx + 1}`}
                        className={`rounded-full transition-all ${isActive ? "w-4 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/50 hover:bg-white/80"}`}
                      />
                    );
                  })}
                </div>
                <div className="absolute top-3 right-3 z-10 bg-black/40 backdrop-blur-sm text-white text-xs px-2 py-0.5 rounded-full">
                  {current + 1}&nbsp;/&nbsp;{photos.length}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl opacity-40">🏖️</span>
          </div>
        )}
        <span className="absolute top-3 left-3 z-10 bg-navy/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {listing.location.city}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-navy text-lg leading-tight mb-1">{listing.externalName}</h3>
        <p className="text-sm text-navy/55 mb-3 line-clamp-2">{listing.airbnbSummary || listing.description}</p>
        <div className="flex gap-4 text-sm text-navy/60 mb-3">
          <span>🛏 {listing.bedroomsNumber} BR</span>
          <span>🚿 {listing.bathroomsNumber} BA</span>
          <span>👥 {listing.personCapacity}</span>
        </div>
        {highlightAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {highlightAmenities.map((a) => (
              <span key={a} className="text-xs bg-blue/8 text-blue px-2 py-0.5 rounded-full font-medium">{a}</span>
            ))}
            {extraAmenities > 0 && <span className="text-xs text-navy/40">+{extraAmenities} more</span>}
          </div>
        )}
        <div className="mt-auto flex flex-col gap-2">
          <a href={listing.holidayfutureUrl || BOOKING_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm w-full">
            Book Now →
          </a>
          <div className="flex gap-2">
            {listing.airbnbUrl && (
              <a href={listing.airbnbUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm flex-1 border border-blue/20 text-xs">Airbnb</a>
            )}
            {listing.bookingUrl && (
              <a href={listing.bookingUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm flex-1 border border-blue/20 text-xs">Booking.com</a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
