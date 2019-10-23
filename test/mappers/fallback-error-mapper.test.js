'use strict';

/**
 * Module dependencies.
 */

const fallbackErrorMapper = require('src/mappers/fallback-error-mapper');

/**
 * Test `FallbackErrorMapper`.
 */

describe('FallbackErrorMapper', () => {
  describe('map()', () => {
    it('should map to code `UNKNOWN`', () => {
      expect(fallbackErrorMapper.map()).toEqual({
        body: { code: 'unknown', message: 'Unknown error' },
        status: 2
      });
    });
  });
});
