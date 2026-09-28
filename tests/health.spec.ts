import { test, expect } from '../src/fixtures/api';

test.describe('Health check', () => {
  test('GET /ping returns 201 @smoke', async ({ request }) => {
    const response = await request.get('/ping');
    expect(response.status()).toBe(201);
  });
});
