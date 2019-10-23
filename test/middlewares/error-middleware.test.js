'use strict';

/**
 * Module dependencies.
 */

const GrpcError = require('grpc-error');
const Mali = require('mali');
const caller = require('grpc-caller');
const errorMiddleware = require('src/middlewares/error-middleware');
const path = require('path');

/**
 * Constants.
 */

const host = 'localhost:50051';
const proto = path.resolve(__dirname, '../utils/protos/example.proto');

/**
 * Instances.
 */

const client = caller(host, proto, 'Example');

/**
 * Test `ErrorMiddleware`.
 */

describe('ErrorMiddleware', () => {
  let app;

  afterEach(async () => {
    await app.close();
  });

  it('should not map `GrpcError` error instances', async () => {
    const mapper = {
      map: jest.fn(() => {})
    };
    const error = new GrpcError('Foo', 1);

    jest.spyOn(mapper, 'map');

    app = new Mali();
    app.silent = true;
    app.addService(proto);
    app.use(errorMiddleware([mapper]));
    app.use(() => {
      throw error;
    });
    app.use({ exampleFn: () => {} });
    app.start(host);

    try {
      await client.exampleFn({});

      fail();
    } catch (e) {
      expect(mapper.map).not.toHaveBeenCalled();
      expect(e.code).toEqual(2);
      expect(e.details).toEqual('Foo');
      expect(e.metadata).toEqual(
        expect.objectContaining({
          _internal_repr: {
            error: ['Error: Foo']
          }
        })
      );
    }
  });

  it('should convert the error to `GrpcError` and throw it if no mapper handles it', async () => {
    const mapper = {
      map: jest.fn(() => {})
    };
    const error = new Error('Foobar');

    app = new Mali();
    app.silent = true;
    app.addService(proto);
    app.use(errorMiddleware([mapper]));
    app.use(() => {
      throw error;
    });
    app.use({ ExampleFn: () => {} });
    app.start(host);

    try {
      await client.exampleFn({});

      fail();
    } catch (e) {
      expect(mapper.map).toHaveBeenCalledTimes(1);
      expect(e.code).toEqual(2);
      expect(e.details).toEqual('Foobar');
      expect(e.metadata).toEqual(
        expect.objectContaining({
          _internal_repr: {
            error: ['Error: Foobar']
          }
        })
      );
    }
  });

  it('should throw a mapped error if a mapper handles it', async () => {
    const mapper = {
      map: jest.fn(() => {
        throw new GrpcError('Bar', 123);
      })
    };
    const error = new Error('Foo');

    app = new Mali();
    app.silent = true;
    app.addService(proto);
    app.use(errorMiddleware([mapper]));
    app.use(() => {
      throw error;
    });
    app.use({ ExampleFn: () => {} });
    app.start(host);

    try {
      await client.exampleFn({});

      fail();
    } catch (e) {
      expect(mapper.map).toHaveBeenCalledTimes(1);
      expect(mapper.map).toHaveBeenCalledWith(error);
      expect(e).toEqual(
        expect.objectContaining({
          code: 123,
          details: 'Bar'
        })
      );
    }
  });
});
