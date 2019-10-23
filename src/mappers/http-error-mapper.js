'use strict';

/**
 * Module dependencies.
 */

const { HttpError } = require('@uphold/http-errors');
const GrpcError = require('grpc-error');
const status = require('../enums/grpc-status.enum');

/**
 * HTTP to gRPC code mapping.
 */

const httpCodeToGrpcCode = code => {
  switch (code) {
    case 400:
      return status.INVALID_ARGUMENT;
    case 401:
      return status.UNAUTHENTICATED;
    case 403:
      return status.PERMISSION_DENIED;
    case 404:
      return status.NOT_FOUND;
    case 409:
      return status.ABORTED;
    case 412:
      return status.FAILED_PRECONDITION;
    case 429:
      return status.RESOURCE_EXHAUSTED;
    case 499:
      return status.CANCELLED;
    case 500:
      return status.UNKNOWN;
    case 501:
      return status.UNIMPLEMENTED;
    case 503:
      return status.UNAVAILABLE;
    case 504:
      return status.DEADLINE_EXCEEDED;
    // Everything else is unknown.
    default:
      return status.UNKNOWN;
  }
};

/**
 * Class `HttpErrorMapper`.
 */

class HttpErrorMapper {
  map(e) {
    if (!(e instanceof HttpError)) {
      return;
    }

    throw new GrpcError(e.message, httpCodeToGrpcCode(e.code), {
      errors: JSON.stringify(e.errors || {}),
      status: e.code
    });
  }
}

/**
 * Export `httpErrorMapper`.
 */

module.exports = HttpErrorMapper;
