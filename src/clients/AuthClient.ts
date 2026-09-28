import { APIRequestContext, APIResponse } from '@playwright/test';

export class AuthClient {
  constructor(private readonly request: APIRequestContext) {}

  createToken(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  /** Returns a valid token or throws, so tests fail early with a clear message. */
  async getToken(
    username = process.env.API_USERNAME ?? 'admin',
    password = process.env.API_PASSWORD ?? 'password123',
  ): Promise<string> {
    const response = await this.createToken(username, password);
    const body = await response.json();
    if (!body.token) {
      throw new Error(`Could not get auth token: ${JSON.stringify(body)}`);
    }
    return body.token;
  }
}
