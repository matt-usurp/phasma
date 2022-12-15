# `@phasma/handler`

An agnostic handler and light-weight middleware implementation.

> Create simplistic and maintainable entrypoint-based applications.

For more information or raising issues please use the main [phasma](https://github.com/matt-usurp/phasma) repository on GitHub.

## Getting Started

The package is available on all registries and can be installed with your standard commands:

```
npm i @phasma/handler
```

This package on its own its not much use, its purpose is to provide a base for more tailored and technology specific variants to be created.
**If you are looking for pre-made technology packages** then consider the following:

- `@phasma/handler-aws` for use with `lambda` on `aws` ([github](https://github.com/matt-usurp/phasma/tree/main/packages/@phasma/handler-aws) | [npm](https://www.npmjs.com/package/@phasma/handler-aws))

# Integration Documentation

Below we explain the methodology and implementation details for working with custom technologies or existing providers that we have no official support for.

The crash course in the design of `@phasma/handler` is:

- A `Handler` contains the composition of services or business logic, these require `Context` to be available and are expected to return some kind of `Response` format.

- Using `Middleware` you can provide additional `Context` (using data available through the `Provider`) and transform `Response` formats to be compatible with the `Provider` implementation.
It is possible to also `try-catch` and act like an error boundary for third-party monitoring tools.

- The `Context` is a data requirement by the `Handler` or any `Middleware` implementations.
You can read into more advanced topics around context in [understanding context](#understanding-context) below.

- A `Composition` is created from a `Handler` with an optional series of `Middleware`, these are chained together to create the flow of data in both directions.
All `Middleware` are called in order, passing `Context` down the chain until finally the `Handler` is invoked.
Once the `Handler` returns a `Response` it is passed back up the chain until it reaches the `Provider` implementation.

- The `Provider` implementation wires the `Composition` to a technologies interface allowing for it to be triggered with the expected inputs and return the expected outputs.

All of this is **strictly type-safe** and mus all be defined through typed first.
The `Composition` has some advanced type-checking that validates that a given `Handler` has the `Content` and compatible `Response` formats available, these are all provided through `Middleware` or the `Provider` itself.

Here are common topics:

- Creating [custom providers](#custom-providers) and their implementations.
- Considerations for [developer experience](#developer-experience) and how to improve it.
- How to [define handlers](#defining-handlers) and understanding their purpose.
- How to [define middleware](#defining-middleware) and understanding their purpose.
- More on [understanding context](#understanding-context) in-depth.

## Custom Providers

A `Provider` is a simple function that can perform the following:

```ts
function impl(composition: C): (...inputs: I) => O;
```

It is given a `Composition` (of type `C`) and is expected to return a functiont that is compatible with the technology being implemented against
In this case a function that takes in a number of inputs (of type `I`) and outputs something (of type `O`).

A real example of this is the `aws-lambda` implementation available in `@phasma/handler-aws`:

```ts
function impl(composition: C): (event: LE, contenxt: LC) => LO
```

> This is compatible with `aws-lambda` as functions are invoked with an event (of type `LE`) as the first argument, then the second argument is the function context (of type `LC`) which is not to be confused with our concept of `Context`.
> The output (of type `LO`) is dependant on the given event, but for example, this could be a api gateway proxy result or nothing.

Other than the implementation, there are a few meta types that needed to be created that completes the integration.
I understand this documentation could be more complete, but for now digging around the `@phasma/handler-aws` implementation should clear up any confusion ([found here](https://github.com/matt-usurp/phasma/tree/main/packages/@phasma/handler-aws/src/core/provider.ts)).

## Developer Experience

Once the `Provider` implementation is complete its about creating a better developer experience.
This can be done through some abstractions to make usage easier or through creating some variations of `@phasma/handler` base types with some options pre-provided.

One example is providing a function that returns a pre-typed `Builder` for creating a `Composition` with your `Provider`.
In the `@phasma/handler-aws` package we provide a function called `aws()` that allows for the `Builder` to be generated easily without needing to know the types to use.
We also provide a some `string` alias representation of events that are supported that automatically type the `Handler` and `Middleware` definitions for us.

This allows for an implementation to be type input free and look like this:
```ts
export const handler = aws<'sqs'>((builder) => {
  return builder
    .use(new WithSomeMiddleware())
    .use(new WithAnotherMiddleware())
    .handler(new MyHandler());
});
```

Instead of having to know the internals of the library and supply the technology specific types for each handler like this:
```ts
export const handler = (new CompositionBuilder<SQSEvent, SQSResponse>())
  .use(new WithSomeMiddleware())
  .use(new WithAnotherMiddleware())
  .handler(new MyHandler());
```

Although the first implementation has a few other benefits regarding lazy-loading and being able to provide additional data via the internal function arguments, they are much the same in what they are trying to do.

## Defining Handlers

A handler is where the business logic and service composition happens.
It is comparable to the controller in the Model View Controller (MVC) pattern.

To get the type-safety (which is the purpose of the library) we have to build a definition type up front with the expected inputs and outputs.
Here we introduce the `Handler.Definition` which is defined as follows:

```ts
type Definition = Handler.Definition<P, C, R>;
```

Where:

- `P` is a `Provider` type.
This indicates to the `Handler` what information it can get from the `{ provider }` input parameter.

- `C` is the `Context` required for the `Handler` to execute.
This can be any object, however know that either `Provider` has to satisfy this or `Middleware` need to introduce what is missing.
This will cause build errors if not satisfied completely.

- `R` is the `Response` type returned.
This must be supported by the `Provider` or via `Middleware` that can handle its transformation.
This will cause build errors if not satisfied completely.

This process can be simplified by composing your `Context` from types defined along-side `Middleware` whilst also maintaining common `Response` types across your application.

When the `Handler.Definition` is completed we can implement it as a class as follows:

```ts
class MyHandler implements Handler.Implementation<Definition> {
  public async handle({ provider, context }: Handler.Fn.Input<Definition>): Handler.Fn.Output<Definition> {
    return;
  }
}
```

Of course, as you have full control of the class you can do dependency injection through the constructor and fully test your handler.

## Defining Middleware

Much like [defining handlers](#defining-handlers) the definition of `Middleware` is done through types first and then code implementation last.
But before we get into defining a `Middleware` definition type we should consider what `Middleware` can do and what we want to achieve with it.

- Can provide additional `Context` down chain.
- Can enable custom `Response` types from down chain.
- Can operate on the `Provider` input data.
- Can return early, short-circuiting and bypassing the `Handler`.
- Can act as an error boundary through `try-catch`.

Knowing this, our `Middleware.Definition` type is a little more complex as it needs to define both inbound and outbound types for both `Context` and `Response` if they are used.
It is possible to "inherit" values using the `Middleware.Definition.Inherit.*` types in their correct positions.

Here is an example of a middleware definition that does nothing type wise, being completely passive and having no affect on the composition:

```ts
type Definition = (
  Middleware.Definition<
    Middleware.Definition.Inherit.Provider,
    Middleware.Definition.Inherit.ContextInbound,
    Middleware.Definition.Inherit.ContextOutbound,
    Middleware.Definition.Inherit.ResponseInbound,
    Middleware.Definition.Inherit.ResponseOutbound
  >
);
```

Here is an example of a middleware that would add a random number to all future context:

```ts
type Definition = (
  Middleware.Definition<
    Middleware.Definition.Inherit.Provider,
    Middleware.Definition.Inherit.ContextInbound,
    { readonly random: number },
    Middleware.Definition.Inherit.ResponseInbound,
    Middleware.Definition.Inherit.ResponseOutbound
  >
);
```

> The `...Inherit.ContextOutbound` has been replaced with an object `{ readonly random: number }` which will be merged into the active `Context` of the `Composition`.
> Other `Middleware` can define this in their `ContextInbound` and as long as they are defined later with `.use()` there will be no type errors.
> Like-wise for the `Handler`, it can now require this random number in its context and as long as the implementation of this `Middleware` is used the types will build correctly.

Here is a middleware that requires a random number and returns whether the number is odd as context:

```ts
type Definition = (
  Middleware.Definition<
    Middleware.Definition.Inherit.Provider,
    { readonly random: number },
    { readonly isOdd: boolean },
    Middleware.Definition.Inherit.ResponseInbound,
    Middleware.Definition.Inherit.ResponseOutbound
  >
);
```

> Note that the `{ readonly random: number }` has moved up to `ContextInbound`, making it a requirement for this `Middleware`.
> Like-wise we return new context, without the random number.
> This doesn't mean the random number is no longer available, it merged and always available to the `Composition` it is used with.

The `ResponseInbound` and `ResponseOutbound` parameters work the same.

The implementation is very similar to `Handler` but instead we have an `invoke()` method and an additional `{ next }` parameter given as input:

```ts
class MyMiddleware implements Middleware.Implementation<Definition> {
  public async invoke({ provider, context, next }: Middleware.Fn.Input<Definition>): Middleware.Fn.Output<Definition> {
    return next(context);
  }
}
```

Again, like `Handler` implementations you have control of the constructor for dependency injection and testability.

There are a few rules to obey when writing the implementation:

- A middleware **must** call `next()` unless it wishes to short-circuit the composition.
This must be done by providing a valid response that is compatible with the `Provider` or another middleware that was defined prior.

- The `next()` function **must** be called with the given context merged with any additional context that is defined by types.
This ensures that context is always available and you handle the priority of merging your new context in.

- The `next()` can be wrapped in `try-catch` to act as an error boundary.
Again, ensure you return a valid response that is compatible with the `Provider` or another middleware that was defined prior.

- The response from `next()` **must** always be returned, even if you are testing out a custom response you cannot guarantee another response that your middleware is un-typed for is not going to be passed down.
This ensures other middleware can handle their responses and the concern of your middleware is only its targetted response.

An important design decision when building `Middleware` is to make small and concise units that provide small amounts of context.
These can be composed and contribute to the contextual needs of the `Handler` as context is merged from all middleware.
This allows middleware implementations to be easily testable and re-usable by making use of their constructors.

## Understanding Context

If you have read [defining handlers](#defining-handlers) and [defining middleware](#defining-middleware) you may have a better understand of what we mean by context.
It can be better thought of as required parameter input for a `Handler` or `Middlware` to operate.
We do this by merging the `Middleware` outbound context types as part of the `Composition` chaining, allowing context to "be built up" as middleware as added with `.use()`, this then is used by the `Handler` to ensure its context is fulfilled.

> That is, a `Handler` might only define a partial amount of context that is "over provided" by `Middleware`, but the `Handler` is fine with that.
> Obviously, a `Handler` requiring more context than it is getting from `Middleware` will result in build errors.

To run through a visual example, lets look at a more fragmented composition and how its types are built up within the composition:

```ts
(new CompositionBuilder())
// composed context is empty to start with
// unless a provider provides some base context

.use(new WithQueryParameters<Q>())
// provides { query: Q } to context

// composed context looks as follows:
// { query: Q }

.use(new WithPagination())
// requires { query: Record<string, string | undefined> }
// provides { pagination: { limit: number, page: number } }

// composed context looks as follows:
// { query: Q; pagination: { .. } }

.use(new WithBody<B>())
// provides { body: B }

// composed context looks as follows:
// { query: Q; pagination: { .. }; body: B }

.handle(new MyHandler());
// requires { authorised: boolean; body: B; pagination: { .. } }
// build error, missing authorised in required context!
// none of the middleware provide it
// lets "undo" and add the missing middleware ..

.use(new WithAuthorisation())
// provides { authorised: boolean; user: { .. } }

// composed context looks as follows:
// { query: Q; pagination: { .. }; body: B; authorised: boolean; user: { .. }; }

.handle(new MyHandler());
// requires { authorised: boolean; body: B; pagination: { .. } }
// now it works!
// note it only requires a partial amount of context too
```

The bonus now is that the `Handler` has all this work done for it and can safely assume that context will always be provided because of the type-safety.
