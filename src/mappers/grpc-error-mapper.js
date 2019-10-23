'use strict';

/**
 * Module dependencies.
 */

const codes = require('../enums/grpc-status-codes-enum');
const messages = require('../enums/grpc-status-messages-enum');
const GrpcError = require('grpc-error');

/**
 * Constants.
 */

const STATUS_CODE_TO_NAME = Object.fromEntries(Object.entries(codes).map(code => code.reverse()));

/**
 * Class `GrpcErrorMapper`.
 */

class GrpcErrorMapper {
  map(e) {
    if (!(e instanceof GrpcError)) {
      return;
    }

    const name = STATUS_CODE_TO_NAME[e.code];

    // If the `code` couldn't be mapped, this is likely a new code introduced by a
    // newer of version of gRPC. By intentionally skipping it'll eventually be mapped
    // to an unknown error by the fallback mapper.
    if (!name) {
      return;
    }

    return {
      body: {
        code: name.replace(/\s+/g, '_').toLowerCase(),
        message: e.metadata && e.metadata.get('expose') ? e.message : messages[name]
      },
      status: e.code
    };
  }
}

/**
 * Export `GrpcErrorMapper`.
 */

module.exports = new GrpcErrorMapper();
