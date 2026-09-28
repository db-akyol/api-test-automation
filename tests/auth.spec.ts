import { test, expect } from '../src/fixtures/api';
import { validateToken, schemaErrors } from '../src/schemas/schemas';

test.describe('Auth - POST /auth', () => {
  test('valid credentials return a token @smoke', async ({ authClient }) => {
    const response = await authClient.createToken(
      process.env.API_USERNAME ?? 'admin',
      process.env.API_PASSWORD ?? 'password123',
    );

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(validateToken(body), schemaErrors(validateToken)).toBe(true);
  });

  const invalidCases = [
    { name: 'wrong password', username: 'admin', password: 'wrong' },
    { name: 'unknown user', username: 'nobody', password: 'password123' },
    { name: 'empty credentials', username: '', password: '' },
  ];

  for (const c of invalidCases) {
    test(`${c.name} does not return a token`, async ({ authClient }) => {
      const response = await authClient.createToken(c.username, c.password);
      const body = await response.json();

      expect(body.token).toBeUndefined();
      expect(body.reason).toBe('Bad credentials');
    });
  }

  test('a token from the API can be used for a protected call', async ({ bookingClient, token, existingBooking }) => {
    const response = await bookingClient.partialUpdate(existingBooking.bookingid, { additionalneeds: 'Dinner' }, token);
    expect(response.status()).toBe(200);
  });
});
