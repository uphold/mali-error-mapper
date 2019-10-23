'use strict';

/**
 * Module dependencies.
 */

const _ = require('lodash');
const { INVALID_ARGUMENT } = require('../enums/grpc-status.enum');
const { ValidationFailedError } = require('@uphold/http-errors');
const GrpcError = require('grpc-error');
const sf = require('sf');
const standardMessages = require('../messages/validation-failed-error-messages');

/**
 * Maps a violation to a well-formatted object
 * with support for arguments.
 */

function mapViolation(violation, messages) {
  const mapping = messages[violation.assert.__class__] || messages.Generic;
  const output = {
    code: mapping.code,
    message: mapping.message
  };

  if (mapping && mapping.args) {
    output.args = {};

    mapping.args.forEach(arg => {
      if (_.isUndefined(violation.assert[arg])) {
        return;
      }

      output.args[arg] = violation.assert[arg];
    });

    if (_.isEmpty(output.args)) {
      delete output.args;
    }
  }

  if (mapping && mapping.message) {
    // Replace message tokens by actual values.
    output.message = sf(mapping.message, violation.assert || {});
  }

  return output;
}

/**
 * `ValidationFailedError` class.
 */

class ValidationFailedErrorMapper {
  /**
   * Constructor.
   */

  constructor(validationMessages = {}) {
    this.messages = { ...standardMessages, ...validationMessages };
  }

  /**
   * Export `map`.
   */

  map(e) {
    if (!this.supports(e)) {
      return;
    }

    const { messages } = this;

    function mapViolations(value) {
      // If we have a `Violation`, return its mapped representation. Do not
      // test by instance type (`value instanceof Violation`) because a
      // different package version (e.g. validator.js@0.6.1 vs
      // validator.js@1.0.0) will fail this test. Regardless, we only need to
      // make sure that the `assert` property has the data needed for mapping
      // the violation correctly.

      if (value && value.assert && value.assert.__class__) {
        // Deal with the special `HaveProperty` case since validator.js does
        // not throw a `Violation` with an array of errors but, instead, a
        // single key object. For consistency with all other errors, we force
        // an array on the output.
        const errors = mapViolation(value, messages);

        if (value.assert.__class__ === 'HaveProperty' && !_.isArray(errors)) {
          return [errors];
        }

        return errors;
      }

      // If we have an array, enter the recursion and return an array
      // of mapped violations.
      if (_.isArray(value)) {
        return _.map(value, mapViolations);
      }

      // Otherwise, enter the recursion and return an object with values
      // of mapped violations.
      return {
        code: 'validation_failed',
        errors: _.mapValues(value, mapViolations)
      };
    }

    throw new GrpcError('Validation failed', INVALID_ARGUMENT, {
      errors: JSON.stringify(mapViolations(e.errors)),
      status: e.code
    });
  }

  /**
   * Export `supports`.
   */

  supports(e) {
    return e instanceof ValidationFailedError;
  }
}

/**
 * Export `ValidationFailedErrorMapper`.
 */

module.exports = ValidationFailedErrorMapper;
