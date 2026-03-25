import Link from 'next/link';
import Image from 'next/image';
import type { ApartmentParsed } from '@/types';
import { getApartmentPlaceholder } from '@/lib/utils';

const BOOKING_URL = process.env.NEXT_PUBLIC_BOOKING_URL || 'https://126222_1.holidayfuture.com/';

export default function ApartmentCard({ apt }: { apt: ApartmentParsed }) {
  const cover = apt.cover_photo || apt.photos[0] || '';
  const emoji = getApartmentPlaceholder(apt.name);

  return (
    <div className="card-base flex flex-col overflow-hidden">
      {/* Photo */}
      <div className="relative aspect-video bg-gradient-to-br from-blue/20 to-ocean/30 flex items-center justify-center overflow-hidden">
        {cover ? (
          <Image src={cover} alt={apt.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" />
        ) : (
          <span className="text-5xl opacity-60">{emoji}</span>
        )}
        <span className="absolute top-3 left-3 bg-navy/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
          {apt.location.split(',')[0]}
        </span>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-navy text-lg leading-tight mb-1">{apt.name}</h3>
        <p className="text-sm text-navy/55 mb-3 line-clamp-2">{apt.description}</p>

        {/* Meta */}
        <div className="flex gap-4 text-sm text-navy/60 mb-3">
          <span>🛏 {apt.bedrooms} BR</span>
          <span>🚿 {apt.bathrooms} BA</span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {apt.amenities.slice(0, 4).map(a => (
            <span key={a} className="text-xs bg-blue/8 text-blue px-2 py-0.5 rounded-full font-medium">{a}</span>
          ))}
          {apt.amenities.length > 4 && (
            <span className="text-xs text-navy/40">+{apt.amenities.length - 4} more</span>
          )}
        </div>

        {/* Booking links */}
        <div className="mt-auto flex flex-col gap-2">
          <a
            href={apt.holidayfuture_url || BOOKING_URL}
            target="_blank" rel="noopener noreferrer"
            className="btn btn-primary btn-sm w-full"
          >
            Book Now →
          </a>
          <div className="flex gap-2">
            {apt.airbnb_url && (
              <a href={apt.airbnb_url} target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-sm flex-1 border border-blue/20 text-xs">
                Airbnb
              </a>
            )}
            {apt.booking_url && (
              <a href={apt.booking_url} target="_blank" rel="noopener noreferrer"
                className="btn btn-ghost btn-sm flex-1 border border-blue/20 text-xs">
                Booking.com
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
