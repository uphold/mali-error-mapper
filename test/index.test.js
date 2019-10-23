'use strict';

/**
 * Module dependencies.
 */

const index = require('src/index');
const middleware = require('src/middlewares/error-mapper-middleware');

/**
 * Test `Index`.
 */

describe('Index', () => {
  it('should export the error mapper middleware', () => {
    expect(index).toEqual(middleware);
  });
});
