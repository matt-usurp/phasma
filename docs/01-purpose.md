# Phasma's Purpose

With the industry moving to more focused and scalable units of code, such as functions as a service (FaaS) and more generically serverless technology there feels to be a gap between going full vanilla and super indepth frameworks.
The purpose of `phasma` is to introduce a more light-weight middle ground that allows you full expressive control of your code but provide the type safety and modularity of modern frameworks.
To be clear, `phasma` does not claim to be a framework, just a means of simplifying and organising your entrypoints.
That is why `phasma` packages focus on the idea of "handlers" and not "controllers".

With `phasma` you are introduced to the hopefully familiar concepts of the request, response and middleware.
However there implementation is 99% type based, resulting in extremely light weight code after compilation.
Although the middleware type safety looks complex the confidence and simplicity of handler logic makes it worth it.

All base types are designed to be agnostic of the FaaS provider ([read the base handler documentation](./handler/01-overview.md)), and instead provider specific libraries are already created (or are faily simple to create).
Official providers are:

- `@phasma/handler-aws` for `aws-lambda` support

If your provider is not listed then consider request one and providing some of the base work to kick us off.
Ideally we would have support for the major cloud providers (`aws`, `azure` and `gcp`) along with some of the more popular tooling (such as `next`).

> The handlers are not purely focused at `http` either, it is possible to use this package with other styles or compose a framework on top.
