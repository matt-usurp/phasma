import type { Grok } from '@matt-usurp/grok';
import { HandlerContextConstraint } from '../component/context';
import { HandlerComposition, HandlerDefinition, HandlerImplementationWithHandleFunction } from '../component/handler';
import { HandlerMiddlewareDefinition, HandlerMiddlewareImplementationWithInvokeFunction, HandlerMiddlewareNextFunction } from '../component/middleware';
import { HandlerMiddlewareValueInheritResponse } from '../component/middleware/inherit';
import { HandlerProviderConstraint } from '../component/provider';
import { HandlerResponseConstraint } from '../component/response';

type ErrorInferMiddlewareDefinition = 'ErrorInferMiddlewareDefinition';
type ErrorInferContextOutbound = 'ErrorInferContextOutbound';
type ErrorInferResponseInbound = 'ErrorInferResponseInbound';

/**
 * An internal type that is used to create type free next functions.
 * These are used when building the composite function returned by the builder.
 */
type HandlerBuilderPassThroughFunction = HandlerMiddlewareNextFunction<any, any>;

/**
 * A handler builder for composing handlers and middleware.
 */
export class HandlerBuilder<
  Provider extends HandlerProviderConstraint,
  CurrentContext extends HandlerContextConstraint,
  CurrentResponse extends HandlerResponseConstraint,
  OriginContext extends HandlerContextConstraint = CurrentContext,
  OriginResponse extends HandlerResponseConstraint = CurrentResponse
> {
  /**
   * All middleware in order of execution.
   * The types bound to the middleware is not important here, its important that the handlers type mutates.
   * With the type safety we can only assume these handlers are going to work.
   */
  protected readonly middlewares: HandlerMiddlewareImplementationWithInvokeFunction<any>[] = [];

  /**
   * Use a middleware at this position in the call stack.
   * These middleware are executed in order before the handler.
   * Changes to the context and response will bubble between them as expected.
   */
  public use<
    M extends HandlerMiddlewareImplementationWithInvokeFunction<
      HandlerMiddlewareDefinition<
        HandlerMiddlewareDefinition.SomeProvider,
        CurrentContext,
        HandlerMiddlewareDefinition.SomeContextOutbound,
        HandlerMiddlewareDefinition.SomeResponseInbound,
        CurrentResponse | HandlerMiddlewareValueInheritResponse
      >
    >
  >(middleware: M): (
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
  ) {
    this.middlewares.push(middleware);

    return this as any;
  }

  /**
   * Terminate the build process by executing the given handler.
   * This function can be passed to a provider or executed manually.
   */
  public handle<
    H extends HandlerImplementationWithHandleFunction<
      HandlerDefinition<
        HandlerMiddlewareDefinition.SomeProvider,
        HandlerContext,
        HandlerResponse
      >
    >,
    HandlerContext extends CurrentContext,
    HandlerResponse extends CurrentResponse,
  >(handler: H): HandlerComposition<H, Provider, OriginContext, OriginResponse> {
    const composite: HandlerComposition<H, Provider, OriginContext, OriginResponse> = async (input) => {
      const { provider, context } = input;

      if (this.middlewares.length === 0) {
        return handler.handle({
          provider,
          context: context as any,
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

    // @ts-ignore Assignment to read-only property
    composite.$handler = handler;

    return composite;
  }
}
