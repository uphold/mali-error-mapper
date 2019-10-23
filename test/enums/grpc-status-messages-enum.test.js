'use strict';

/**
 * Module dependencies.
 */

const codes = require('src/enums/grpc-status-codes-enum');
const messages = require('src/enums/grpc-status-messages-enum');

/**
 * Test `GrpcStatusMessages`.
 */

describe('GrpcStatusMessages', () => {
  it.each(Object.keys(codes))('should export the %s error message', code => {
    expect(messages).toHaveProperty(code);
  });
});
