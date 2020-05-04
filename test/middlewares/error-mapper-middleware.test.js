'use strict';

/**
 * Module dependencies.
 */

const GrpcError = require('grpc-error');
const caller = require('test/utils/grpc-caller-util');
const codes = require('src/enums/grpc-status-codes-enum');
const errorMapperMiddleware = require('src/middlewares/error-mapper-middleware');
const fixtures = require('test/utils/fixtures-util');
const messages = require('src/enums/grpc-status-messages-enum');

/**
 * Test `ErrorMapperMiddleware`.
 */

describe('ErrorMapperMiddleware', () => {
  let app;
  let client;

  beforeEach(() => {
    app = fixtures.loadApp(['example']);
    client = caller(app);
  });

  it('should use a fallback mapper if no mapping was found', async () => {
    const mapper = {
      map: () => {}
    };

    app.use(errorMapperMiddleware([mapper]));
    app.use(() => {
      throw new Error();
    });

    try {
      await client.example.exampleFn();

      fail();
    } catch (e) {
      expect(e.code).toEqual(codes.UNKNOWN);
      expect(e.details).toEqual(messages.UNKNOWN);
    }
  });

  it('should use a fallback mapper if an error was thrown in the mapper', async () => {
    const mapper = {
      map: e => {
        if (e instanceof SyntaxError) {
          return;
        }

        throw new SyntaxError();
      }
    };

    app.use(errorMapperMiddleware([mapper]));
    app.use(() => {
      throw new Error();
    });

    try {
      await client.example.exampleFn();

      fail();
    } catch (e) {
      expect(e.code).toEqual(codes.UNKNOWN);
      expect(e.details).toEqual(messages.UNKNOWN);
    }
  });

  it('should map gRPC errors', async () => {
    app.use(errorMapperMiddleware());
    app.use(() => {
      throw new GrpcError(codes.CANCELLED);
    });

    try {
      await client.example.exampleFn();

      fail();
    } catch (e) {
      expect(e.code).toEqual(codes.CANCELLED);
      expect(e.details).toEqual(messages.CANCELLED);
      expect(e.metadata.getMap()).toEqual({ code: 'cancelled' });
    }
  });

  it('should map custom errors', async () => {
    const mapper = {
      map: jest.fn(() => ({
        body: {
          code: 'foo',
          message: 'bar'
        },
        metadata: {
          errors: {}
        },
        status: 999
      }))
    };

    app.use(errorMapperMiddleware([mapper]));
    app.use(() => {
      throw new Error();
    });

    try {
      await client.example.exampleFn();

      fail();
    } catch (e) {
      expect(e.code).toEqual(999);
      expect(e.details).toEqual('bar');
      expect(e.metadata.getMap()).toEqual({ code: 'foo', errors: '{}' });
    }
  });
});
