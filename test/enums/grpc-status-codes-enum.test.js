'use strict';

/**
 * Module dependencies.
 */

const codes = require('src/enums/grpc-status-codes-enum');
const { status: STATUS_CODES } = require('grpc');

/**
 * Test `GrpcStatusCodes`.
 */

describe('GrpcStatusCodes', () => {
  it.each(Object.keys(STATUS_CODES))('should export the %s error code', code => {
    expect(codes).toHaveProperty(code, STATUS_CODES[code]);
  });
});
