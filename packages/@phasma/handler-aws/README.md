# `@phasma/handler-aws`

An implementation of `@phasma/handler` designed for working with **Amazon Web Services** Lambda.

> Create simplistic and maintainable entrypoint-based applications.

For more information or raising issues please use the main [phasma](https://github.com/matt-usurp/phasma) repository on GitHub.

## Getting Started

The package is available on all registries and can be installed with your standard commands:

```
npm i @phasma/handler-aws
```

This package provides pre-defined implementations for the `lambda` technology.
Depending on the service you want to use the integration will look similar to this:

```ts
import { aws } from '@phasma/handler-aws';

export const handler = aws<'apigw:proxy:v2'>((application) => {
  return application
    .use(new WithRequestQueryValidator())
    .use(new WithRequestBodyValidator())
    .handle(new GetUserCollectionHandler())
});
```

> Where `handler` is the export that `lambda` will be pointed to to execute your function.

This will follow the following process:

1. When the `handler` is invoked by `lambda` the event is taken in and the composition is triggered.
2. The middleware `WithRequestQueryValidator` is invoked to provide any context from the provider event.
3. The middleware `WithRequestBodyValidator` is invoked to provide any context from the provider event.
4. The handler `GetUserCollectionHandler` is invoked with the context and performs some business logic, it returns a response.
5. The middleware `WithRequestBodyValidator` receives the response and does any transformation if required, if not it passes the response down the chain.
6. The middleware `WithRequestQueryValidator` receives the response and does any transformation if required, if not it passes the response down the chain.
7. The provider receives the response, does some final transformations (if required) and returns to `lambda`.

More details on how this works at its core can be found in the `@phasma/handler` package which this extends, documentation can be [found here](https://github.com/matt-usurp/phasma/tree/main/packages/@phasma/handler).

## Working with Events

> TODO

### Defining Events

> TODO

## Defining Handlers

> TODO

## Defining Middleware

> TODO
