'use strict';

/**
 * Module dependencies.
 */

const { snakeCase } = require('lodash');
const GrpcError = require('grpc-error');
const grpcErrorMapper = require('src/mappers/grpc-error-mapper');
const codes = require('src/enums/grpc-status-codes-enum');
const messages = require('src/enums/grpc-status-messages-enum');

/**
 * Test `GrpcErrorMapper`.
 */

describe('GrpcErrorMapper', () => {
  describe('map()', () => {
    it('should return `undefined` if the error is not supported', () => {
      const result = grpcErrorMapper.map(new Error());

      expect(result).toBe(undefined);
    });

    it('should return `undefined` if the code is not found', () => {
      const result = grpcErrorMapper.map(new GrpcError(-999));

      expect(result).toBe(undefined);
    });

    it('should support errors with metadata', () => {
      const error = new GrpcError('Exposed error message', codes.CANCELLED, { foo: 'bar' });
      const mapped = grpcErrorMapper.map(error);

      expect(mapped.body.message).toEqual('Exposed error message');
    });

    it.each(Object.keys(codes))('should map a grpc `%s` error', code => {
      const mapped = grpcErrorMapper.map(new GrpcError(codes[code]));

      expect(mapped).toEqual({
        body: {
          code: snakeCase(code),
          message: messages[code]
        },
        status: codes[code]
      });
    });
  });
});
