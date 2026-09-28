import { Booking } from '../types';

const firstNames = ['Deniz', 'Ayse', 'Mehmet', 'Elif', 'Can', 'Zeynep'];
const lastNames = ['Akyol', 'Yilmaz', 'Kaya', 'Demir', 'Sahin', 'Celik'];
const needs = ['Breakfast', 'Late checkout', 'Airport transfer', 'Extra bed'];

const pick = <T>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

/** Date as YYYY-MM-DD, `days` days from today. */
export function dateFromToday(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

/**
 * Builds a valid booking. A unique last name makes every booking easy to find
 * with the filter endpoint, even on a shared public API.
 */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  const stayStart = 10 + Math.floor(Math.random() * 60);
  return {
    firstname: pick(firstNames),
    lastname: `${pick(lastNames)}${Date.now().toString().slice(-6)}`,
    totalprice: 50 + Math.floor(Math.random() * 950),
    depositpaid: Math.random() > 0.5,
    bookingdates: {
      checkin: dateFromToday(stayStart),
      checkout: dateFromToday(stayStart + 3),
    },
    additionalneeds: pick(needs),
    ...overrides,
  };
}
