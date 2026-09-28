import { test, expect } from '../src/fixtures/api';
import { buildBooking } from '../src/data/bookingFactory';
import { validateBooking, validateCreatedBooking, validateBookingIdList, schemaErrors } from '../src/schemas/schemas';

test.describe('Booking - CRUD', () => {
  test('create a booking @smoke', async ({ bookingClient, token }) => {
    const booking = buildBooking();

    const response = await bookingClient.create(booking);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(validateCreatedBooking(body), schemaErrors(validateCreatedBooking)).toBe(true);
    expect(body.booking).toEqual(booking);

    await bookingClient.delete(body.bookingid, token);
  });

  test('get a booking by id', async ({ bookingClient, existingBooking }) => {
    const response = await bookingClient.get(existingBooking.bookingid);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(validateBooking(body), schemaErrors(validateBooking)).toBe(true);
    expect(body).toEqual(existingBooking.booking);
  });

  test('list booking ids', async ({ bookingClient }) => {
    const response = await bookingClient.getIds();

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(validateBookingIdList(body), schemaErrors(validateBookingIdList)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
  });

  test('update a booking with PUT', async ({ bookingClient, token, existingBooking }) => {
    const updated = buildBooking({ firstname: 'Updated', totalprice: 999, depositpaid: true });

    const response = await bookingClient.update(existingBooking.bookingid, updated, token);

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual(updated);

    const check = await bookingClient.get(existingBooking.bookingid);
    expect(await check.json()).toEqual(updated);
  });

  test('update some fields with PATCH', async ({ bookingClient, token, existingBooking }) => {
    const response = await bookingClient.partialUpdate(
      existingBooking.bookingid,
      { firstname: 'Patched', additionalneeds: 'Late checkout' },
      token,
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.firstname).toBe('Patched');
    expect(body.additionalneeds).toBe('Late checkout');
    // Fields that were not sent must not change
    expect(body.lastname).toBe(existingBooking.booking.lastname);
    expect(body.totalprice).toBe(existingBooking.booking.totalprice);
    expect(body.bookingdates).toEqual(existingBooking.booking.bookingdates);
  });

  test('delete a booking', async ({ bookingClient, token, existingBooking }) => {
    const response = await bookingClient.delete(existingBooking.bookingid, token);
    expect(response.ok()).toBeTruthy();

    const check = await bookingClient.get(existingBooking.bookingid);
    expect(check.status()).toBe(404);
  });
});
