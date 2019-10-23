'use strict';

/**
 * Module dependencies.
 */

const { Assert, Violation } = require('validator.js');
const { ValidationFailedError } = require('@uphold/http-errors');
const { is, validate } = require('test/utils/validations/validator');
const ValidationFailedErrorMapper = require('src/mappers/validation-failed-error-mapper');

/**
 * Test `ValidationFailedErrorMapper`.
 */

describe('ValidationFailedErrorMapper', () => {
  const mapper = new ValidationFailedErrorMapper();

  describe('map()', () => {
    it('should return `undefined` if the error is not supported', () => {
      const error = mapper.map(new Error());

      expect(error).toBeUndefined();
    });

    it('should map status to code `INVALID_ARGUMENT`', () => {
      try {
        mapper.map(new ValidationFailedError());

        fail();
      } catch (e) {
        // INVALID_ARGUMENT
        expect(e.code).toEqual(3);
        expect(e.message).toEqual('Validation failed');
      }
    });

    it('should support empty errors', () => {
      try {
        mapper.map(new ValidationFailedError());

        fail();
      } catch (e) {
        expect(e.metadata.getMap()).toEqual({
          errors: '{"code":"validation_failed","errors":{}}',
          status: '400'
        });
      }
    });

    it('should support constraints with arguments', () => {
      try {
        validate(
          { foo: 0 },
          {
            foo: is.bigNumberGreaterThanOrEqualTo(10)
          }
        );

        fail();
      } catch ({ errors }) {
        try {
          mapper.map(new ValidationFailedError(errors));

          fail();
        } catch (e) {
          expect(e.metadata.getMap()).toEqual({
            errors:
              '{"code":"validation_failed","errors":{"foo":[{"code":"greater_than_or_equal_to","message":"This value should be greater than or equal to 10","args":{"threshold":"10"}}]}}',
            status: '400'
          });
        }
      }
    });

    it('should support an unmapped constraint and map it to a generic one', () => {
      class FooConstraint extends Assert {
        validate(value) {
          throw new Violation(this, value);
        }
      }

      try {
        validate(
          {
            foo: 'bar'
          },
          {
            foo: new FooConstraint()
          }
        );

        fail();
      } catch ({ errors }) {
        try {
          mapper.map(new ValidationFailedError(errors));

          fail();
        } catch (e) {
          expect(e.metadata.getMap()).toEqual({
            errors:
              '{"code":"validation_failed","errors":{"foo":[{"code":"invalid","message":"This value is not valid"}]}}',
            status: '400'
          });
        }
      }
    });
  });
});
