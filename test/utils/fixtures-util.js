'use strict';

/**
 * Module dependencies.
 */

const Mali = require('mali');

/**
 * Instances.
 */

const protos = `${__dirname}/protos`;

/**
 * Export fixtures.
 */

module.exports = {
  /**
   * Loads a Mali app with the given proto file.
   */

  loadApp(services = []) {
    const app = new Mali();
    const start = app.start.bind(app);

    app.silent = true;

    services.map(service => {
      app.addService(`${protos}/${service}.proto`);
    });

    // Install a middleware that closes the app after all work is done.
    app.use(async (context, next) => {
      try {
        await next();
      } finally {
        app.close();
        app.ports = [];
      }
    });

    return Object.assign(app, {
      start: (...args) => {
        // Automatically implements every service call with an empty function, if not already defined.
        for (const [, { handlers, service }] of Object.entries(app.data)) {
          for (const [, { originalName, path }] of Object.entries(service)) {
            if (!handlers[path]) {
              app.use(originalName, jest.fn());
            }
          }
        }

        // Call the original start function.
        return start(...args);
      }
    });
  }
};
