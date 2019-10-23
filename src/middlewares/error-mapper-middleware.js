'use strict';

/**
 * Module dependencies.
 */

const GrpcError = require('grpc-error');
const fallbackErrorMapper = require('../mappers/fallback-error-mapper');
const grpcErrorMapper = require('../mappers/grpc-error-mapper');

/**
 * Export error mapper middleware.
 */

module.exports = function(mappers = []) {
  mappers = [...mappers, grpcErrorMapper, fallbackErrorMapper];

  function map(e) {
    for (const mapper of mappers) {
      const mapping = mapper.map(e);

      if (mapping) {
        return mapping;
      }
    }
  }

  return async function mapper(ctx, next) {
    try {
      await next();
    } catch (e) {
      let mapping;

      try {
        mapping = map(e);
      } catch (e) {
        mapping = map(e);
      }

      const metadata = {
        code: mapping.body.code,
        ...mapping.metadata
      };

      throw new GrpcError(mapping.body.message, mapping.status, metadata);
    }
  };
};
