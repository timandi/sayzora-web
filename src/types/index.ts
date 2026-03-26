export interface SiteSettings {
  contact_email: string;
  instagram_url: string;
  facebook_url: string;
  whatsapp_number: string;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
}

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

export interface Listing {
  id: number;
  name: string;
  description: string;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  roomType: string;
  location: { city: string; state?: string; countryCode?: string; address?: string };
  amenities: { id: number; name: string; category: string; description: string | null }[];
  photos: { url: string; caption: string }[];
  externalName: string;
  airbnbSummary?: string;
  holidayfutureUrl?: string;
  airbnbUrl?: string;
  bookingUrl?: string;
}

export function getApartment(listing: ListingData) {
  return {
    id: listing.listingId,
    name: listing.listingName,
    description: listing.description,
    capacity: listing.personCapacity,
    bedrooms: listing.bedroomsNumber,
    bathrooms: listing.bathroomsNumber,
    roomType: listing.roomType,
    location: listing.location,
    amenities: listing.amenities,
    photos: listing.photos.map((p) => ({ url: p.url, caption: p.caption })),
    externalName: listing.externalName,
    airbnbSummary: listing.airbnbSummary,
    holidayfutureUrl: listing.holidayfutureUrl,
    airbnbUrl: listing.airbnbUrl,
    bookingUrl: listing.bookingUrl,
  } as Listing;

}

export const BLOB_PATHS = {
  settings: "sayzora/settings.json",
  content: "sayzora/content.json",
  listings: "sayzora/listings.json",
} as const;
