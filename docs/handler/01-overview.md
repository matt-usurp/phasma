# Overview

At the heart of `phasma` is the handler component.
It follows a very simple design that allows it to be provider agnostic and still provide the configurability for 100% type safety.

```
npm i @phasma/handler
```

## Providers

A provider is the framework that the handler is being ran against, either this is some platform that provides a service or something custom.
In most cases this is a cloud provider (such as `aws`) and their service (such as `lambda`) constitutes a provider in this case.

Its main purpose is to interface and translate the responses from handlers into responses that are compatible with the service.
For example, in the `@phasma/handler-aws` the [provider](../../packages/@phasma/handler-aws/src/core/provider.ts) deals with the api for the service to call our handler, transform the incoming event and outgoing response.
This can either be enforced through types or code that handles the transformation, its up to you and the requirements of the service.

## Handlers

A handler is an entrypoint where your application logic lives.
It can be abstracted as needed, but like in functional programming it requires a set of inputs (called context) and will provide a series of responses.
A handler defines its expected context through types of which the provider or middleware need to satisfy for the application to be successfuly composed with the builder.
These handlers are slim classes with no inheritance, so you have control of the constructor for dependency injection.

## Middleware

A middleware allows the transformation and generation of context before (or after if we consider response transformation) the handler has been called.
This is especially handy for removing concerns from your handlers, such as, handling the parsing of query strings or validating the payload given via a `POST` request.
Multiple middleware can be used and all partially satisfy the expected context of the handler being composed.
That is, should a handler require a complex type then many middleware can be used to build up to that.
These middleware are defined much the same as handlers, so you have control of the constructor for dependency injection.

## Builders

The builder is the glue and is often exposed via a provider specific function that lets you compose middleware and your handler.
The nature of the builder is to ensure that all context required for your handler is provided by the middleware in use, as well as ensuring the response from the handler is compatible with the providers expected response patterns.
When context is missing there will be a type error that should indicate that a middleware is missing or your handler is not properly configured.
