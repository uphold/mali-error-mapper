'use strict';

/**
 * Module dependencies.
 */

const _ = require('lodash');
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

      let metadata = {
        code: mapping.body.code,
        ...mapping.metadata
      };

      metadata = _.transform(metadata, (result, value, key) => {
        if (_.isPlainObject(value)) {
          result[key] = JSON.stringify(value);
        } else {
          result[key] = value;
        }
      });

      throw new GrpcError(mapping.body.message, mapping.status, metadata);
    }
  };
};
