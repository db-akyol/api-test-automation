import { test, expect } from '../src/fixtures/api';
import { buildBooking } from '../src/data/bookingFactory';

test.describe('Booking - negative cases', () => {
  test('PUT without a token is forbidden', async ({ bookingClient, existingBooking }) => {
    const response = await bookingClient.update(existingBooking.bookingid, buildBooking());
    expect(response.status()).toBe(403);
  });

  test('PATCH with an invalid token is forbidden', async ({ bookingClient, existingBooking }) => {
    const response = await bookingClient.partialUpdate(existingBooking.bookingid, { firstname: 'Hacker' }, 'invalid-token');
    expect(response.status()).toBe(403);

    // The booking must stay the same
    const check = await bookingClient.get(existingBooking.bookingid);
    expect((await check.json()).firstname).toBe(existingBooking.booking.firstname);
  });

  test('DELETE without a token is forbidden', async ({ bookingClient, existingBooking }) => {
    const response = await bookingClient.delete(existingBooking.bookingid);
    expect(response.status()).toBe(403);

    const check = await bookingClient.get(existingBooking.bookingid);
    expect(check.status()).toBe(200);
  });

  test('GET a booking that does not exist returns 404', async ({ bookingClient }) => {
    const response = await bookingClient.get(999999999);
    expect(response.status()).toBe(404);
  });
});
