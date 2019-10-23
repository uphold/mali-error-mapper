'use strict';

/**
 * Export `ValidationFailedErrorMessages`.
 */

module.exports = {
  BigNumberGreaterThan: {
    args: ['threshold'],
    code: 'greater_than',
    message: 'This value should be greater than {threshold}'
  },
  BigNumberGreaterThanOrEqualTo: {
    args: ['threshold'],
    code: 'greater_than_or_equal_to',
    message: 'This value should be greater than or equal to {threshold}'
  },
  BigNumberLessThan: {
    args: ['threshold'],
    code: 'less_than',
    message: 'This value should be less than {threshold}'
  },
  BigNumberLessThanOrEqualTo: {
    args: ['threshold'],
    code: 'less_than_or_equal_to',
    message: 'This value should be less than or equal to {threshold}'
  },
  Count: {
    args: ['count'],
    code: 'count',
    message: 'This value should only have {count} elements'
  },
  Currency: {
    code: 'invalid_currency',
    message: 'This value is not a valid currency'
  },
  DateDiffGreaterThanOrEqualTo: {
    args: ['threshold', 'unit'],
    code: 'greater_than_or_equal_to',
    message: 'This date should be older than or equal to {threshold} {unit} ago'
  },
  DuplicateEmail: {
    code: 'duplicate_email',
    message: 'This email is already in use'
  },
  Email: {
    code: 'email',
    message: 'This value is not a valid email'
  },
  EmailDomainBlacklisted: {
    code: 'email',
    message: 'This value is not a valid email'
  },
  EqualTo: {
    args: ['reference'],
    code: 'equal_to',
    message: 'This value should be equal to {reference}'
  },
  Generic: {
    code: 'invalid',
    message: 'This value is not valid'
  },
  GreaterThan: {
    args: ['threshold'],
    code: 'greater_than',
    message: 'This value should be greater than {threshold}'
  },
  GreaterThanOrEqual: {
    args: ['threshold'],
    code: 'greater_than_or_equal_to',
    message: 'This value should be greater than or equal to {threshold}'
  },
  HaveProperty: {
    code: 'required',
    message: 'This value is required'
  },
  Length: {
    args: ['min', 'max'],
    code: 'length',
    message: 'This value must have between {min} and {max} characters'
  },
  LessThan: {
    args: ['threshold'],
    code: 'less_than',
    message: 'This value should be less than {threshold}'
  },
  NotBlank: {
    code: 'not_blank',
    message: 'This value should not be blank'
  },
  NotEmpty: {
    code: 'not_empty',
    message: 'This value should not be empty'
  },
  NotNull: {
    code: 'not_null',
    message: 'This value should not be null'
  },
  NullOrString: {
    args: ['min', 'max'],
    code: 'null_or_string',
    message: 'This value must be null or a string'
  },
  PasswordUnique: {
    args: ['createdAt'],
    code: 'password_unique',
    message: 'This password has already been used'
  },
  PersonName: {
    code: 'name',
    message: 'This value contains symbols or numbers that are not valid'
  },
  Unique: {
    args: ['key'],
    code: 'unique',
    message: 'This value must only contain unique values'
  }
};
