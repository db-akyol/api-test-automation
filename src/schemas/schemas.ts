import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const bookingSchema = {
  type: 'object',
  required: ['firstname', 'lastname', 'totalprice', 'depositpaid', 'bookingdates'],
  properties: {
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    totalprice: { type: 'number' },
    depositpaid: { type: 'boolean' },
    bookingdates: {
      type: 'object',
      required: ['checkin', 'checkout'],
      properties: {
        checkin: { type: 'string', format: 'date' },
        checkout: { type: 'string', format: 'date' },
      },
    },
    additionalneeds: { type: 'string' },
  },
};

export const validateBooking = ajv.compile(bookingSchema);

export const validateCreatedBooking = ajv.compile({
  type: 'object',
  required: ['bookingid', 'booking'],
  properties: {
    bookingid: { type: 'integer' },
    booking: bookingSchema,
  },
});

export const validateBookingIdList = ajv.compile({
  type: 'array',
  items: {
    type: 'object',
    required: ['bookingid'],
    properties: { bookingid: { type: 'integer' } },
  },
});

export const validateToken = ajv.compile({
  type: 'object',
  required: ['token'],
  properties: { token: { type: 'string', minLength: 1 } },
});

/** Readable error text for expect(...) messages. */
export const schemaErrors = (validate: { errors?: unknown }): string =>
  JSON.stringify(validate.errors ?? [], null, 2);
