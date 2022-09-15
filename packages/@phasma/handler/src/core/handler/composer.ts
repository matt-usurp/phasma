import type { Grok } from '@matt-usurp/grok';
import type { HandlerContextConstraint } from '../../component/context';
import type { HandlerClassImplementation, HandlerComposition, HandlerDefinition } from '../../component/handler';
import type { HandlerMiddlewareClassImplementation, HandlerMiddlewareDefinition, HandlerMiddlewareNextFunction } from '../../component/middleware';
import type { HandlerMiddlewareResponsePassThrough } from '../../component/middleware/inherit';
import type { HandlerProviderConstraint } from '../../component/provider';
import type { HandlerResponseConstraint } from '../../component/response';

/**
 * An internal type that is used to create type free next functions.
 * These are used when building the composite function returned by the {@link HandlerComposer}.
 */
type HandlerComposerPassThroughFunction = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareNextFunction<
    any, // eslint-disable-line @typescript-eslint/no-explicit-any
    any // eslint-disable-line @typescript-eslint/no-explicit-any
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * A constraint type for {@link HandlerMiddlewareClassImplementation} using {@link CurrentContext} and {@link CurrentResponse}.
 */
export type HandlerMiddlewareClassImplementationForCurrentUsageConstraint<
  CurrentContext extends HandlerContextConstraint,
  CurrentResponse extends HandlerResponseConstraint,
> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareClassImplementation<
    HandlerMiddlewareDefinition<
      any, // eslint-disable-line @typescript-eslint/no-explicit-any
      CurrentContext,
      any, // eslint-disable-line @typescript-eslint/no-explicit-any
      any, // eslint-disable-line @typescript-eslint/no-explicit-any
      CurrentResponse | HandlerMiddlewareResponsePassThrough
    >
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * Merge the given {@link Middleware} into the current {@link HandlerComposer} type.
 *
 * The defined context should be merged with the current available context.
 * The defined response will be added to the available responses.
 * If either of the above are {@link Grok.Inherit} then their values are ignored, they will have no effect.
 */
export type HandlerComposerWithMiddlware<
  Provider extends HandlerProviderConstraint,
  ProviderContext extends HandlerContextConstraint,
  ProviderResponse extends HandlerResponseConstraint,
  CurrentContext extends HandlerContextConstraint,
  CurrentResponse extends HandlerResponseConstraint,
  Middleware extends HandlerMiddlewareClassImplementationForCurrentUsageConstraint<CurrentContext, CurrentResponse>,
> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerComposer<
    Provider,
    (
      Middleware extends HandlerMiddlewareClassImplementation<infer InferDefinition>
        ? (
          InferDefinition extends (
            HandlerMiddlewareDefinition<
              any, // eslint-disable-line @typescript-eslint/no-explicit-any
              any, // eslint-disable-line @typescript-eslint/no-explicit-any
              infer InferContextOutbound,
              any, // eslint-disable-line @typescript-eslint/no-explicit-any
              any // eslint-disable-line @typescript-eslint/no-explicit-any
            >
          )
            ? HandlerComposerWithMiddlware.ResolveContext<CurrentContext, InferContextOutbound>
            : 'Error:InferContextOutbound'
        )
        : 'Error:InferMiddlewareDefinition'
    ),
    (
      Middleware extends HandlerMiddlewareClassImplementation<infer InferDefinition>
        ? (
          InferDefinition extends (
            HandlerMiddlewareDefinition<
              any, // eslint-disable-line @typescript-eslint/no-explicit-any
              any, // eslint-disable-line @typescript-eslint/no-explicit-any
              any, // eslint-disable-line @typescript-eslint/no-explicit-any
              infer InferResponseInbound,
              any // eslint-disable-line @typescript-eslint/no-explicit-any
            >
          )
            ? HandlerComposerWithMiddlware.ResolveResponse<CurrentResponse, InferResponseInbound>
            : 'Error:InferResponseInbound'
        )
        : 'Error:InferMiddlewareDefinition'
    ),
    ProviderContext,
    ProviderResponse
  >
/* eslint-enable @typescript-eslint/indent */
);

export namespace HandlerComposerWithMiddlware {
  /**
   * A utility type to assist with resolving the context for the {@link HandlerComposer}.
   *
   * The {@link Current} is always expected to be a valid context type.
   * The {@link Value} is unknown, and thus we need to validate it before using it.
   * The result is either a {@link Grok.Merge} of both inputs or {@link Current} on its own.
   */
  export type ResolveContext<Current extends HandlerContextConstraint, Value> = (
  /* eslint-disable @typescript-eslint/indent */
    Grok.If.IsInherit<
      Grok.Inherit.Normalise<Value>,
      Current,
      Grok.Merge<Current, Value>
    >
  /* eslint-enable @typescript-eslint/indent */
  );

  /**
   * A utility type to assist with resolving the response for the {@link HandlerComposer}.
   *
   * The {@link Current} is always expected to be a valid response type.
   * The {@link Value} is unknown, and thus we need to validate it before using it.
   * The result is either a {@link Grok.Union} of both inputs or {@link Current} on its own.
   */
  export type ResolveResponse<Current extends HandlerResponseConstraint, Value> = (
  /* eslint-disable @typescript-eslint/indent */
    Grok.If.IsInherit<
      Grok.Inherit.Normalise<Value>,
      Current,
      Grok.Union<Current, Value>
    >
  /* eslint-enable @typescript-eslint/indent */
  );
}

/**
 * A handler composer.
 *
 * This class builds a composition chain by link middlewares with handlers.
 * The response is a composition that will trigger the chain.
 */
export class HandlerComposer<
  Provider extends HandlerProviderConstraint,
  CurrentContext extends HandlerContextConstraint,
  CurrentResponse extends HandlerResponseConstraint,
  ProviderContext extends HandlerContextConstraint = CurrentContext,
  ProviderResponse extends HandlerResponseConstraint = CurrentResponse,
> {
  /**
   * All middleware in order of registration.
   */
  protected readonly middlewares: HandlerMiddlewareClassImplementation<any>[] = []; // eslint-disable-line @typescript-eslint/no-explicit-any

  /**
   * Use the given {@link Middleware} as part of the composition chain.
   */
  public use<
    Middleware extends (
    /* eslint-disable @typescript-eslint/indent */
      HandlerMiddlewareClassImplementation<
        HandlerMiddlewareDefinition<
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          CurrentContext,
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          CurrentResponse | HandlerMiddlewareResponsePassThrough
        >
      >
    /* eslint-enable @typescript-eslint/indent */
    ),
  >(middleware: Middleware): HandlerComposerWithMiddlware<Provider, ProviderContext, ProviderResponse, CurrentContext, CurrentResponse, Middleware> {
    this.middlewares.push(middleware);

    return this as any; // eslint-disable-line @typescript-eslint/no-explicit-any
  }

  /**
   * Use the given {@link Handler} and complete the composition.
   */
  public handle<
    Handler extends (
    /* eslint-disable @typescript-eslint/indent */
      HandlerClassImplementation<
        HandlerDefinition<
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          HandlerContext,
          HandlerResponse
        >
      >
    /* eslint-enable @typescript-eslint/indent */
    ),
    HandlerContext extends CurrentContext,
    HandlerResponse extends CurrentResponse,
  >(handler: Handler): HandlerComposition<Handler, Provider, ProviderContext, ProviderResponse> {
    const composite: HandlerComposition<Handler, Provider, ProviderContext, ProviderResponse> = async (input) => {
      const { provider, context } = input;

      if (this.middlewares.length === 0) {
        return handler.handle({
          // The type here is `never` because the constraint on the method uses `any`.
          // There is nothing we can do here type-wise, but this is considered safe.
          provider: provider as never,
          context: context as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        });
      }

      /**
       * Middleware next function that will terminate with the handler.
       * This will execute the handler and start the response transformation.
       */
      const terminate: HandlerComposerPassThroughFunction = async (context) => {
        return handler.handle({
          // The type here is `never` because the constraint on the method uses `any`.
          // There is nothing we can do here type-wise, but this is considered safe.
          provider: provider as never,
          context,
        });
      };

      /**
       * A composite function with all the middlewares chained together.
       * Each middleware is strung together in order with the handler terminating the stack.
       */
      const stack = this.middlewares.reduceRight<HandlerComposerPassThroughFunction>((next, middleware) => {
        return async (context) => {
          return middleware.invoke({
            // The type here is `never` because the constraint on the method uses `any`.
            // There is nothing we can do here type-wise, but this is considered safe.
            provider: provider as never,
            context,
            next,
          });
        };
      }, terminate);

      return stack(context);
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error Assignment to read-only property
    composite.$handler = handler;

    return composite;
  }
}
