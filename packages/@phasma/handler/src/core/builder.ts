import type { Grok } from '@matt-usurp/grok';
import type { HandlerContextConstraint } from '../component/context';
import type { HandlerComposition, HandlerDefinition, HandlerImplementationWithHandleFunction } from '../component/handler';
import type { HandlerMiddlewareDefinition, HandlerMiddlewareImplementationWithInvokeFunction, HandlerMiddlewareNextFunction } from '../component/middleware';
import type { HandlerMiddlewareResponsePassThrough } from '../component/middleware/inherit';
import type { HandlerProviderConstraint } from '../component/provider';
import type { HandlerResponseConstraint } from '../component/response';

type ErrorInferMiddlewareDefinition = 'ErrorInferMiddlewareDefinition';
type ErrorInferContextOutbound = 'ErrorInferContextOutbound';
type ErrorInferResponseInbound = 'ErrorInferResponseInbound';

/**
 * An internal type that is used to create type free next functions.
 * These are used when building the composite function returned by the builder.
 */
type HandlerBuilderPassThroughFunction = HandlerMiddlewareNextFunction<Grok.Constraint.Anything, Grok.Constraint.Anything>;

/**
 * A handler builder for composing handlers and middleware.
 */
export class HandlerBuilder<
  Provider extends HandlerProviderConstraint,
  CurrentContext extends HandlerContextConstraint,
  CurrentResponse extends HandlerResponseConstraint,
  OriginContext extends HandlerContextConstraint = CurrentContext,
  OriginResponse extends HandlerResponseConstraint = CurrentResponse,
> {
  /**
   * All middleware in order of execution.
   * The types bound to the middleware is not important here, its important that the handlers type mutates.
   * With the type safety we can only assume these handlers are going to work.
   */
  protected readonly middlewares: HandlerMiddlewareImplementationWithInvokeFunction<Grok.Constraint.Anything>[] = [];

  /**
   * Use a middleware at this position in the call stack.
   * These middleware are executed in order before the handler.
   * Changes to the context and response will bubble between them as expected.
   */
  public use<
    /* eslint-disable @typescript-eslint/indent */
    M extends HandlerMiddlewareImplementationWithInvokeFunction<
      HandlerMiddlewareDefinition<
        HandlerMiddlewareDefinition.SomeProvider,
        CurrentContext,
        HandlerMiddlewareDefinition.SomeContextOutbound,
        HandlerMiddlewareDefinition.SomeResponseInbound,
        CurrentResponse | HandlerMiddlewareResponsePassThrough
      >
    >,
    /* eslint-enable @typescript-eslint/indent */
  >(middleware: M): (
  /* eslint-disable @typescript-eslint/indent */
    HandlerBuilder<
      Provider,
      (
        M extends HandlerMiddlewareImplementationWithInvokeFunction<infer InferDefinition>
          ? (
            InferDefinition extends HandlerMiddlewareDefinition<
              HandlerMiddlewareDefinition.SomeProvider,
              HandlerMiddlewareDefinition.SomeContextInbound,
              infer InferContextOutbound,
              HandlerMiddlewareDefinition.SomeResponseInbound,
              HandlerMiddlewareDefinition.SomeResponseOutbound
            >
              ? Grok.Merge<InferContextOutbound, CurrentContext>
              : ErrorInferContextOutbound
          )
          : ErrorInferMiddlewareDefinition
      ),
      (
        M extends HandlerMiddlewareImplementationWithInvokeFunction<infer InferDefinition>
          ? (
            InferDefinition extends HandlerMiddlewareDefinition<
              HandlerMiddlewareDefinition.SomeProvider,
              HandlerMiddlewareDefinition.SomeContextInbound,
              HandlerMiddlewareDefinition.SomeContextOutbound,
              infer InferResponseInbound,
              HandlerMiddlewareDefinition.SomeResponseOutbound
            >
              ? Grok.Union<InferResponseInbound, CurrentResponse>
              : ErrorInferResponseInbound
          )
          : ErrorInferMiddlewareDefinition
      ),
      OriginContext,
      OriginResponse
    >
  /* eslint-enable @typescript-eslint/indent */
  ) {
    this.middlewares.push(middleware);

    return this as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  /**
   * Terminate the build process by executing the given handler.
   * This function can be passed to a provider or executed manually.
   */
  public handle<
    /* eslint-disable @typescript-eslint/indent */
    H extends HandlerImplementationWithHandleFunction<
      HandlerDefinition<
        HandlerMiddlewareDefinition.SomeProvider,
        HandlerContext,
        HandlerResponse
      >
    >,
    /* eslint-enable @typescript-eslint/indent */
    HandlerContext extends CurrentContext,
    HandlerResponse extends CurrentResponse,
  >(handler: H): HandlerComposition<H, Provider, OriginContext, OriginResponse> {
    const composite: HandlerComposition<H, Provider, OriginContext, OriginResponse> = async (input) => {
      const { provider, context } = input;

      if (this.middlewares.length === 0) {
        return handler.handle({
          provider,
          context: context as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        });
      }

      /**
       * Middleware next function that will terminate with the handler.
       * This will execute the handler and start the response transformation.
       */
      const terminate: HandlerBuilderPassThroughFunction = async (context) => {
        return handler.handle({
          provider,
          context,
        });
      };

      /**
       * A composite function with all the middlewares chained together.
       * Each middleware is strung together in order with the handler terminating the stack.
       */
      const stack = this.middlewares.reduceRight<HandlerBuilderPassThroughFunction>((next, middleware) => {
        return async (context) => {
          return middleware.invoke({
            provider,
            context,
            next,
          });
        };
      }, terminate);

      return stack(context);
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore Assignment to read-only property
    composite.$handler = handler;

    return composite;
  }
}
