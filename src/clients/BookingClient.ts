import { APIRequestContext, APIResponse } from '@playwright/test';
import { Booking } from '../types';

export interface BookingFilter {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

/**
 * API object for the /booking endpoints.
 * Tests call these methods instead of building requests by hand.
 */
export class BookingClient {
  constructor(private readonly request: APIRequestContext) {}

  private authHeaders(token?: string): Record<string, string> {
    return token ? { Cookie: `token=${token}` } : {};
  }

  getIds(filter: BookingFilter = {}): Promise<APIResponse> {
    return this.request.get('/booking', { params: { ...filter } });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  create(booking: Partial<Booking>): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  update(id: number, booking: Booking, token?: string): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.authHeaders(token) });
  }

  partialUpdate(id: number, fields: Partial<Booking>, token?: string): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: fields, headers: this.authHeaders(token) });
  }

  delete(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.authHeaders(token) });
  }
}
