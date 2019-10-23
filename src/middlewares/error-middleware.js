'use strict';

/**
 * Module dependencies.
 */

const { status } = require('grpc');
const GrpcError = require('grpc-error');

/**
 * Export `ErrorMiddleware`.
 */

module.exports = function(mappers = []) {
  function map(e) {
    for (const mapper of mappers) {
      mapper.map(e);
    }
  }

  return async function errors(ctx, next) {
    try {
      await next();
    } catch (error) {
      if (!(error instanceof GrpcError)) {
        map(error);
      }

      throw new GrpcError(error.message ? error.message : 'Unknown error', status.UNKNOWN, { error });
    }
  };
};
