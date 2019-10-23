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

## Usage

Using default mapping:

```javascript
'use strict';

const errorMapperMiddleware = require('mali-error-mapper');
const app = new Mali();

app.use(errorMapperMiddleware());
```

Using custom mappers:

```javascript
'use strict';

const errorMapperMiddleware = require('mali-error-mapper');
const app = new Mali();
const mapper = {
  map: e => {
    if (!(e instanceof MyError)) {
      return;
    }

    return {
      body: {
        code: 'foo',
        message: 'bar'
      },
      status: 999
    };
  };
};

app.use(errorMiddleware([mapper]));
```

## License

MIT
