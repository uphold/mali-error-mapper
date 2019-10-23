'use strict';

/**
 * Module dependencies.
 */

const { ValidationFailedError } = require('@uphold/http-errors');
const asserts = require('validator.js-asserts');
const validator = require('@uphold/validator.js');

/**
 * Export `validator`.
 */

module.exports = validator({
  AssertionError: Error,
  ValidationError: ValidationFailedError,
  extraAsserts: asserts
});
