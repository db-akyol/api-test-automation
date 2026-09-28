import { test as base, expect } from '@playwright/test';
import { AuthClient } from '../clients/AuthClient';
import { BookingClient } from '../clients/BookingClient';
import { buildBooking } from '../data/bookingFactory';
import { CreatedBooking } from '../types';

type ApiFixtures = {
  authClient: AuthClient;
  bookingClient: BookingClient;
  token: string;
  /** A booking created before the test and deleted after it. */
  existingBooking: CreatedBooking;
};

export const test = base.extend<ApiFixtures>({
  authClient: async ({ request }, use) => {
    await use(new AuthClient(request));
  },

  bookingClient: async ({ request }, use) => {
    await use(new BookingClient(request));
  },

  token: async ({ authClient }, use) => {
    await use(await authClient.getToken());
  },

  existingBooking: async ({ bookingClient, token }, use) => {
    const response = await bookingClient.create(buildBooking());
    expect(response.ok(), 'setup: create booking').toBeTruthy();
    const created: CreatedBooking = await response.json();

    await use(created);

    // Cleanup: ignore the result, the test may have deleted it already
    await bookingClient.delete(created.bookingid, token);
  },
});

export { expect };
