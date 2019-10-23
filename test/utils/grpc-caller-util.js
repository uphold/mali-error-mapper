'use strict';

/**
 * Module dependencies.
 */

const _ = require('lodash');
const { makeGenericClientConstructor } = require('grpc');
const caller = require('grpc-caller');

/**
 * Export gRPC caller util.
 */

module.exports = app => {
  return new Proxy(app, {
    get: (target, name) => {
      const service = _.find(app.data, { shortServiceName: _.upperFirst(name) });

      if (service) {
        app.start();

        return caller(`0.0.0.0:${app.ports[0]}`, makeGenericClientConstructor(service.service));
      }

      return target[name];
    }
  });
};
