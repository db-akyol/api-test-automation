import { test, expect } from '../src/fixtures/api';

test.describe('Booking - filter GET /booking', () => {
  test('filter by first and last name finds the booking', async ({ bookingClient, existingBooking }) => {
    const { firstname, lastname } = existingBooking.booking;

    const response = await bookingClient.getIds({ firstname, lastname });

    expect(response.status()).toBe(200);
    const ids = (await response.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(existingBooking.bookingid);
  });

  test('filter with an unknown name returns an empty list', async ({ bookingClient }) => {
    const response = await bookingClient.getIds({ firstname: 'NoSuchName', lastname: `x${Date.now()}` });

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual([]);
  });
});
