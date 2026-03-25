export interface Apartment {
  id: number;
  name: string;
  location: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  amenities: string; // JSON array string
  airbnb_url: string;
  booking_url: string;
  holidayfuture_url: string;
  photos: string; // JSON array of paths/URLs
  cover_photo: string;
  sort_order: number;
  active: number; // 0 | 1
  created_at: string;
  updated_at: string;
}

export interface ApartmentParsed extends Omit<Apartment, 'amenities' | 'photos'> {
  amenities: string[];
  photos: string[];
}

export interface PageContent {
  id: number;
  page: string;
  key: string;
  value: string;
  updated_at: string;
}

export interface SiteSettings {
  contact_email: string;
  instagram_url: string;
  facebook_url: string;
  whatsapp_number: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}
