'use strict';

/**
 * Module dependencies.
 */

const { HttpError } = require('@uphold/http-errors');
const { status } = require('grpc');
const GrpcError = require('grpc-error');
const HttpErrorMapper = require('src/mappers/http-error-mapper');

/**
 * Test `HttpErrorMapper`.
 */

describe('HttpErrorMapper', () => {
  const mapper = new HttpErrorMapper();

  describe('map()', () => {
    it('should return `undefined` if the error is not supported', () => {
      const result = mapper.map(new Error());

      expect(result).toBe(undefined);
    });

    it('should map to `UNKNOWN` error if the code is not handled', () => {
      const error = new HttpError(-2);

      try {
        mapper.map(error);

        fail();
      } catch (e) {
        expect(e).toBeInstanceOf(GrpcError);
        expect(e.code).toEqual(status.UNKNOWN);
      }
    });

    it('should map known `errors`', () => {
      const errors = [
        { expected: status.INVALID_ARGUMENT, given: 400 },
        { expected: status.UNAUTHENTICATED, given: 401 },
        { expected: status.PERMISSION_DENIED, given: 403 },
        { expected: status.NOT_FOUND, given: 404 },
        { expected: status.ABORTED, given: 409 },
        { expected: status.FAILED_PRECONDITION, given: 412 },
        { expected: status.RESOURCE_EXHAUSTED, given: 429 },
        { expected: status.CANCELLED, given: 499 },
        { expected: status.UNKNOWN, given: 500 },
        { expected: status.UNIMPLEMENTED, given: 501 },
        { expected: status.UNAVAILABLE, given: 503 },
        { expected: status.DEADLINE_EXCEEDED, given: 504 }
      ];

      errors.forEach(({ expected, given }) => {
        const error = new HttpError(given);

        try {
          mapper.map(error);

          fail();
        } catch (e) {
          expect(e.code).toEqual(expected);
        }
      });
    });
  });
});
