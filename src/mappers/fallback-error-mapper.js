'use strict';

/**
 * Module dependencies.
 */

const codes = require('../enums/grpc-status-codes-enum');
const messages = require('../enums/grpc-status-messages-enum');

/**
 * Class `FallbackErrorMapper`.
 */

class FallbackErrorMapper {
  map() {
    return {
      body: {
        code: 'unknown',
        message: messages.UNKNOWN
      },
      status: codes.UNKNOWN
    };
  }
}

/**
 * Export `FallbackErrorMapper`.
 */

module.exports = new FallbackErrorMapper();
