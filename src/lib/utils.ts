import type { Apartment, ApartmentParsed } from '@/types';

export function parseApartment(apt: Apartment): ApartmentParsed {
  return {
    ...apt,
    amenities: tryParseJson(apt.amenities, []),
    photos: tryParseJson(apt.photos, []),
  };
}

export function tryParseJson<T>(str: string, fallback: T): T {
  try { return JSON.parse(str); } catch { return fallback; }
}

export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

export function getApartmentPlaceholder(name: string) {
  const emojis = ['🏖️','🌅','🏄','🌊','☀️','🌺','🏊','🌴','⛱️','🦀'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffffffff;
  return emojis[Math.abs(h) % emojis.length];
}
