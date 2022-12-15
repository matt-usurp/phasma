import type { Grok } from '@matt-usurp/grok';
import type { HandlerContextConstraint } from './context';
import type { HandlerFunctionInput } from './handler';
import type { HandlerMiddlewareContextPassThrough, HandlerMiddlewareResponsePassThrough } from './middleware/inherit';
import type { HandlerProviderConstraint } from './provider';
import type { HandlerResponseConstraint } from './response';

/**
 * A middleware definition that defines the {@link Provider}, context and response types.
 *
 * These types will be enforced at build type when used with the handler composer.
 * These types can be satisfied through implementing middleware or are provided as a base from the {@link Provider}.
 */
export type HandlerMiddlewareDefinition<
  Provider extends HandlerProviderConstraint | HandlerMiddlewareDefinitionUseAnyProvider,
  ContextInbound extends HandlerContextConstraint | HandlerMiddlewareDefinitionUseAnyContextInbound,
  ContextOutbound extends HandlerContextConstraint | HandlerMiddlewareDefinitionUseAnyContextOutbound,
  ResponseInbound extends HandlerResponseConstraint | HandlerMiddlewareDefinitionUseAnyResponseInbound,
  ResponseOutbound extends HandlerResponseConstraint | HandlerMiddlewareDefinitionUseAnyResponseOutbound,
> = {
  readonly MiddlewareProvider: Provider;
  readonly MiddlewareContextInbound: ContextInbound;
  readonly MiddlewareContextOutbound: ContextOutbound;
  readonly MiddlewareResponseInbound: ResponseInbound;
  readonly MiddlewareResponseOutbound: ResponseOutbound;
};

/**
 * A middleware definition with all "any" or "inherit" values.
 *
 * This means all values are unused and should inherit from the composition chain.
 */
export type HandlerMiddlewareDefinitionBase = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareDefinition<
    HandlerMiddlewareDefinitionUseAnyProvider,
    HandlerMiddlewareDefinitionUseAnyContextInbound,
    HandlerMiddlewareDefinitionUseAnyContextOutbound,
    HandlerMiddlewareDefinitionUseAnyResponseInbound,
    HandlerMiddlewareDefinitionUseAnyResponseOutbound
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * A constraint type for {@link HandlerMiddlewareDefinition}.
 */
export type HandlerMiddlewareDefinitionConstraint = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareDefinition<
    any, // eslint-disable-line @typescript-eslint/no-explicit-any
    any, // eslint-disable-line @typescript-eslint/no-explicit-any
    any, // eslint-disable-line @typescript-eslint/no-explicit-any
    any, // eslint-disable-line @typescript-eslint/no-explicit-any
    any // eslint-disable-line @typescript-eslint/no-explicit-any
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * Retrieve the middleware provider from {@link Definition}.
 */
export type HandlerMiddlewareDefinitionGetProvider<Definition extends HandlerMiddlewareDefinitionConstraint> = Definition['MiddlewareProvider'];

/**
 * Retrieve the middleware inbound context from {@link Definition}.
 */
export type HandlerMiddlewareDefinitionGetContextInbound<Definition extends HandlerMiddlewareDefinitionConstraint> = Definition['MiddlewareContextInbound'];

/**
 * Retrieve the middleware outbound context from {@link Definition}.
 */
export type HandlerMiddlewareDefinitionGetContextOutbound<Definition extends HandlerMiddlewareDefinitionConstraint> = Definition['MiddlewareContextOutbound'];

/**
 * Retrieve the middleware inbound response from {@link Definition}.
 */
export type HandlerMiddlewareDefinitionGetResponseInbound<Definition extends HandlerMiddlewareDefinitionConstraint> = Definition['MiddlewareResponseInbound'];

/**
 * Retrieve the middleware outbound response from {@link Definition}.
 */
export type HandlerMiddlewareDefinitionGetResponseOutbound<Definition extends HandlerMiddlewareDefinitionConstraint> = Definition['MiddlewareResponseOutbound'];

/**
 * A unique symbol used for type purposes to indicate "any provider"
 * This could also be considered "inherit from parent".
 */
const HandlerMiddlewareDefinitionAnyProviderMarker = Symbol();

/**
 * Indicate the provider should be inheritted.
 */
export type HandlerMiddlewareDefinitionUseAnyProvider = typeof HandlerMiddlewareDefinitionAnyProviderMarker;

/**
 * A unique symbol used for type purposes to indicate "any context inbound"
 * This could also be considered "inherit from parent".
 */
const HandlerMiddlewareDefinitionAnyContextInboundMarker = Symbol();

/**
 * Indicate the context inbound should be inheritted.
 */
export type HandlerMiddlewareDefinitionUseAnyContextInbound = typeof HandlerMiddlewareDefinitionAnyContextInboundMarker;

/**
 * A unique symbol used for type purposes to indicate "any context outbound"
 * This could also be considered "inherit from parent".
 */
const HandlerMiddlewareDefinitionAnyContextOutboundMarker = Symbol();

/**
 * Indicate the context outbound should be inheritted.
 */
export type HandlerMiddlewareDefinitionUseAnyContextOutbound = typeof HandlerMiddlewareDefinitionAnyContextOutboundMarker;

/**
 * A unique symbol used for type purposes to indicate "any respond inbound"
 * This could also be considered "inherit from parent".
 */
const HandlerMiddlewareDefinitionAnyResponseInboundMarker = Symbol();

/**
 * Indicate the response inbound should be inheritted.
 */
export type HandlerMiddlewareDefinitionUseAnyResponseInbound = typeof HandlerMiddlewareDefinitionAnyResponseInboundMarker;

/**
 * A unique symbol used for type purposes to indicate "any respond outbound"
 * This could also be considered "inherit from parent".
 */
const HandlerMiddlewareDefinitionAnyResponseOutboundMarker = Symbol();

/**
 * Indicate the response outbound should be inheritted.
 */
export type HandlerMiddlewareDefinitionUseAnyResponseOutbound = typeof HandlerMiddlewareDefinitionAnyResponseOutboundMarker;

/**
 * The next function that resumes the composition chain, invoking either the next middleware or the handler.
 *
 * The {@link Context} is the outbound context that was mentioned in the {@link HandlerMiddlewareDefinition}.
 * This denotes the context that is to be provided down chain to the next middleware or the handler.
 *
 * The {@link Response} is the inbound response that was mentioned in the {@link HandlerMiddlewareDefinition}.
 * This denotes the response that is returned from the down chain middleware or the handler.
 */
export type HandlerMiddlewareNextFunction<
  Context extends HandlerContextConstraint,
  Response extends HandlerResponseConstraint,
> = (context: Context) => Promise<Response>;

/**
 * The middleware invoke function input parameters defining {@link Provider}, {@link Context} and {@link HandlerMiddlewareNextFunction}.
 */
export type HandlerMiddlewareFunctionInputFromDefinition<Definition extends HandlerMiddlewareDefinitionConstraint> = (
  & HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput<Definition>
  & HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction<Definition>
);

export namespace HandlerMiddlewareFunctionInputFromDefinition {
  /**
   * A structure with the {@link HandlerFunctionInput} resolved from {@link Definition}
   */
  export type WithHandlerInput<Definition extends HandlerMiddlewareDefinitionConstraint> = (
  /* eslint-disable @typescript-eslint/indent */
    HandlerFunctionInput<
      Grok.If<
        Grok.Or<[
          Grok.Value.IsAny<HandlerMiddlewareDefinition.Get.Provider<Definition>>,
          Grok.Value.IsExactly<
            HandlerMiddlewareDefinition.Get.Provider<Definition>,
            HandlerMiddlewareDefinitionUseAnyProvider
          >,
        ]>,
        never,
        HandlerMiddlewareDefinition.Get.Provider<Definition>
      >,
      Grok.If<
        Grok.Or<[
          Grok.Value.IsAny<HandlerMiddlewareDefinition.Get.ContextInbound<Definition>>,
          Grok.Value.IsExactly<
            HandlerMiddlewareDefinition.Get.ContextInbound<Definition>,
            HandlerMiddlewareDefinitionUseAnyContextInbound
          >,
        ]>,
        HandlerMiddlewareContextPassThrough,
        Grok.Merge<
          HandlerMiddlewareDefinition.Get.ContextInbound<Definition>,
          HandlerMiddlewareContextPassThrough
        >
      >
    >
  /* eslint-enable @typescript-eslint/indent */
  );

  /**
   * A structure with the {@link HandlerMiddlewareNextFunction} resolved from {@link Definition}.
   */
  export type WithNextFunction<Definition extends HandlerMiddlewareDefinitionConstraint> = {
    /**
     * A middleware function to invoke the next element in the composition chain.
     * This must take in the given context and the response must be returned within the parent function.
     *
     * Note, the inherit symbols are not to be interfaced with in code directly.
     * These indicate an "unknown" possible element that might be handled next in the chain.
     *
     * See {@link HandlerMiddlewareNextFunction} for more information.
     */
    readonly next: (
    /* eslint-disable @typescript-eslint/indent */
      HandlerMiddlewareNextFunction<
        Grok.If<
          Grok.Or<[
            Grok.Value.IsAny<HandlerMiddlewareDefinition.Get.ContextOutbound<Definition>>,
            Grok.Value.IsExactly<
              HandlerMiddlewareDefinition.Get.ContextOutbound<Definition>,
              HandlerMiddlewareDefinitionUseAnyContextOutbound
            >,
          ]>,
          HandlerMiddlewareContextPassThrough,
          Grok.Merge<
            HandlerMiddlewareDefinition.Get.ContextOutbound<Definition>,
            HandlerMiddlewareContextPassThrough
          >
        >,
        Grok.If<
          Grok.Or<[
            Grok.Value.IsAny<HandlerMiddlewareDefinition.Get.ResponseInbound<Definition>>,
            Grok.Value.IsExactly<
              HandlerMiddlewareDefinition.Get.ResponseInbound<Definition>,
              HandlerMiddlewareDefinitionUseAnyResponseInbound
            >,
          ]>,
          HandlerMiddlewareResponsePassThrough,
          Grok.Union<
            HandlerMiddlewareDefinition.Get.ResponseInbound<Definition>,
            HandlerMiddlewareResponsePassThrough
          >
        >
      >
    /* eslint-enable @typescript-eslint/indent */
    );
  };
}

/**
 * The middleware invoke function response resolved from {@link Definition}.
 */
export type HandlerMiddlewareFunctionOutputFromDefinition<Definition extends HandlerMiddlewareDefinitionConstraint> = (
/* eslint-disable @typescript-eslint/indent */
  Promise<
    Grok.If<
      Grok.Or<[
        Grok.Value.IsAny<HandlerMiddlewareDefinition.Get.ResponseOutbound<Definition>>,
        Grok.Value.IsExactly<
          HandlerMiddlewareDefinition.Get.ResponseOutbound<Definition>,
          HandlerMiddlewareDefinitionUseAnyResponseOutbound
        >,
      ]>,
      HandlerMiddlewareResponsePassThrough,
      Grok.Union<
        HandlerMiddlewareDefinition.Get.ResponseOutbound<Definition>,
        HandlerMiddlewareResponsePassThrough
      >
    >
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * A class-based middleware implementation for {@link Definition}
 */
export type HandlerMiddlewareClassImplementation<Definition extends HandlerMiddlewareDefinitionConstraint> = {
  /**
   * Invoke the middleware with the given input parameters.
   *
   * You have access to the following input data, resolved from the {@link Definition}.
   *
   * - `input.context` is the context requested.
   * - `input.provider` is the provider that called the handler.
   * - `input.next()` will resume the composition chain. This function is described {@link HandlerMiddlewareNextFunction here}.
   */
  invoke(input: HandlerMiddlewareFunctionInputFromDefinition<Definition>): HandlerMiddlewareFunctionOutputFromDefinition<Definition>;
};

/**
 * The below import(s) and namespace allows this file to compose a better developer experience through type aliasing.
 * Here we define a series of aliases that provide better naming and a single type import.
 * This is then aliased in the root file with a better name also.
 */
import * as middleware from './middleware';

export namespace HandlerMiddleware {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Definition = middleware.HandlerMiddlewareDefinition;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Implementation = middleware.HandlerMiddlewareClassImplementation;

  /**
   * Types for working with the middleware invoke function signature.
   */
  export namespace Fn {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Input = middleware.HandlerMiddlewareFunctionInputFromDefinition;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Output = middleware.HandlerMiddlewareFunctionOutputFromDefinition;
  }
}

/*!
 * This is a developer experience namespace merge.
 * You are probably looking for the defined type instead, keep searching for another result.
 */
export namespace HandlerMiddlewareDefinition {
  /**
   * Retrieve data from the {@link HandlerMiddlewareDefinition}.
   */
  export namespace Get {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Provider = middleware.HandlerMiddlewareDefinitionGetProvider;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import ContextInbound = middleware.HandlerMiddlewareDefinitionGetContextInbound;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import ContextOutbound = middleware.HandlerMiddlewareDefinitionGetContextOutbound;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import ResponseInbound = middleware.HandlerMiddlewareDefinitionGetResponseInbound;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import ResponseOutbound = middleware.HandlerMiddlewareDefinitionGetResponseOutbound;
  }

  /**
   * Types that indicate a value within {@link HandlerMiddlewareDefinition} should be inheritted.
   * This is typically used when your code doesn't care about a value.
   */
  export namespace Any {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Provider = middleware.HandlerMiddlewareDefinitionUseAnyProvider;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import ContextInbound = middleware.HandlerMiddlewareDefinitionUseAnyContextInbound;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import ContextOutbound = middleware.HandlerMiddlewareDefinitionUseAnyContextOutbound;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import ResponseInbound = middleware.HandlerMiddlewareDefinitionUseAnyResponseInbound;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import ResponseOutbound = middleware.HandlerMiddlewareDefinitionUseAnyResponseOutbound;
  }
}
