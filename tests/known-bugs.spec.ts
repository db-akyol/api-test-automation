import { test, expect } from '../src/fixtures/api';
import { buildBooking } from '../src/data/bookingFactory';

/**
 * These tests describe the CORRECT behaviour, but the API does not do it yet.
 * test.fail() marks them as "expected to fail", so the suite stays green.
 * If the API gets fixed, Playwright reports the test as failing and we know
 * the bug is gone. Details: docs/bug-reports.md
 */
test.describe('Known bugs', () => {
  test('BUG-01: wrong credentials should return 401', async ({ authClient }) => {
    test.fail(true, 'API returns 200 with a "Bad credentials" body');
    const response = await authClient.createToken('admin', 'wrong');
    expect(response.status()).toBe(401);
  });

  test('BUG-02: booking with missing fields should return 400', async ({ bookingClient }) => {
    test.fail(true, 'API returns 500 Internal Server Error');
    const response = await bookingClient.create({ firstname: 'OnlyFirstName' });
    expect(response.status()).toBe(400);
  });

  test('BUG-03: negative total price should be rejected', async ({ bookingClient, token }) => {
    test.fail(true, 'API creates the booking with a negative price');
    const response = await bookingClient.create(buildBooking({ totalprice: -100 }));
    if (response.ok()) {
      await bookingClient.delete((await response.json()).bookingid, token);
    }
    expect(response.status()).toBe(400);
  });

  test('BUG-04: checkout before checkin should be rejected', async ({ bookingClient, token }) => {
    test.fail(true, 'API accepts a checkout date before the checkin date');
    const response = await bookingClient.create(
      buildBooking({ bookingdates: { checkin: '2027-01-10', checkout: '2027-01-01' } }),
    );
    if (response.ok()) {
      await bookingClient.delete((await response.json()).bookingid, token);
    }
    expect(response.status()).toBe(400);
  });

  test('BUG-05: DELETE of a missing booking should return 404', async ({ bookingClient, token }) => {
    test.fail(true, 'API returns 405 Method Not Allowed');
    const response = await bookingClient.delete(999999999, token);
    expect(response.status()).toBe(404);
  });

  test('BUG-06: successful DELETE should return 200 or 204', async ({ bookingClient, token, existingBooking }) => {
    test.fail(true, 'API returns 201 Created for a delete');
    const response = await bookingClient.delete(existingBooking.bookingid, token);
    expect([200, 204]).toContain(response.status());
  });
});
