'use strict';

/**
 * Module dependencies.
 */

const HttpErrorMapper = require('./mappers/http-error-mapper');
const ValidationFailedErrorMapper = require('./mappers/validation-failed-error-mapper');
const errorMiddleware = require('./middlewares/error-middleware');

/**
 * Export errors.
 */

module.exports = {
  HttpErrorMapper,
  ValidationFailedErrorMapper,
  errorMiddleware
};
