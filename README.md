## Mali error mapper

Mali gRPC error mappers and middleware.

## Middleware

This middleware maps all non `GrpcError` errors to a `GrpcError` formatted accordingly.

## Status

[![Build Status](https://travis-ci.com/uphold/mali-error-mapper.svg?branch=master)](https://travis-ci.com/uphold/mali-error-mapper)

## Installation

Install the package via `yarn`:

```sh
❯ yarn add mali-error-mapper
```

or via `npm`:

```sh
❯ npm install mali-error-mapper --save
```

## Mappers

There are three mappers available by default.

- GenericErrorMapper
    ```javascript
    class GenericErrorMapper {
      map(e) {
        throw new GrpcError(e.message, e.code, {
          stack: JSON.stringify(e.stack)
        });
      }
    }
    ```

- HttpErrorMapper
    ```javascript
    class HttpErrorMapper {
      map(e) {
        if (!(e instanceof HttpError)) {
          return;
        }

        throw new GrpcError(e.message, httpCodeToGrpcCode(e.code), {
          errors: JSON.stringify(e.errors || {}),
          status: e.code
        });
      }
    }
    ```

- ValidationFailedErrorMapper
    ```javascript
    class ValidationFailedErrorMapper {
      map(e) {
        ...

        throw new GrpcError('Validation failed', INVALID_ARGUMENT, {
          errors: JSON.stringify(mapViolations(e.errors)),
          status: e.code
        });
      }
    }
    ```

## Usage

Using default validation messages.
```javascript
'use strict';

const { 
  HttpErrorMapper,
  ValidationFailedErrorMapper,
  errorMiddleware
} = require('mali-error-mapper');
const app = new Mali();

// Error mapper middleware.
app.use(
  errorMiddleware([
    new HttpErrorMapper(),
    new ValidationFailedErrorMapper()
  ])
);
```

With custom validation messages.
```javascript
'use strict';

const { 
  HttpErrorMapper,
  ValidationFailedErrorMapper,
  errorMiddleware
} = require('mali-error-mapper');
const app = new Mali();

const customMessages = {
  foobar: {
    code: 'foobar',
    message: 'This is a foobar message'
  },
  // Rewrite Generic error message.
  Generic: {
    code: 'invalid',
    message: 'This value is not valid'
  }
}

// Error mapper middleware.
app.use(errorMiddleware([
  new HttpErrorMapper(),
  new ValidationFailedErrorMapper(customMessages)
]));
```

## License

MIT
