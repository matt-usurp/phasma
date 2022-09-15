import type { Grok } from '@matt-usurp/grok';
import type { HandlerContextConstraint } from './context';
import type { HandlerFunctionInput } from './handler';
import type { HandlerMiddlewareContextPassThrough, HandlerMiddlewareResponsePassThrough } from './middleware/inherit';
import type { HandlerProviderConstraint } from './provider';
import type { HandlerResponseConstraint } from './response';

/**
 * A middleware definition that defines the {@link Provider}, context and response types.
 *
 * These types will be enforced at build type when used with the handler composer/builder.
 * These types can be satisfied through implementing middleware or are provided as a base from the {@link Provider}.
 */
export type HandlerMiddlewareDefinition<
  Provider extends HandlerProviderConstraint,
  ContextInbound extends HandlerContextConstraint,
  ContextOutbound extends HandlerContextConstraint,
  ResponseInbound extends HandlerResponseConstraint,
  ResponseOutbound extends HandlerResponseConstraint,
> = {
  readonly MP: Provider;
  readonly MCI: ContextInbound;
  readonly MCO: ContextOutbound;
  readonly MRI: ResponseInbound;
  readonly MRO: ResponseOutbound;
};

export namespace HandlerMiddlewareDefinition {
  export type SomeProvider = Grok.Constraint.Anything;
  export type SomeContextInbound = Grok.Constraint.Anything;
  export type SomeContextOutbound = Grok.Constraint.Anything;
  export type SomeResponseInbound = Grok.Constraint.Anything;
  export type SomeResponseOutbound = Grok.Constraint.Anything;

  /**
   * Retrieve data from the {@link HandlerMiddlewareDefinition}.
   */
  export namespace Get {
    /**
     * Retrieve the middleware provider from {@link Definition}.
     */
    export type Provider<Definition extends HandlerMiddlewareDefinitionConstraint> = Definition['MP'];

    /**
     * Retrieve the middleware inbound context from {@link Definition}.
     */
    export type ContextInbound<Definition extends HandlerMiddlewareDefinitionConstraint> = Definition['MCI'];

    /**
     * Retrieve the middleware outbound context from {@link Definition}.
     */
    export type ContextOutbound<Definition extends HandlerMiddlewareDefinitionConstraint> = Definition['MCO'];

    /**
     * Retrieve the middleware inbound response from {@link Definition}.
     */
    export type ResponseInbound<Definition extends HandlerMiddlewareDefinitionConstraint> = Definition['MRI'];

    /**
     * Retrieve the middleware outbound response from {@link Definition}.
     */
    export type ResponseOutbound<Definition extends HandlerMiddlewareDefinitionConstraint> = Definition['MRO'];
  }
}

/**
 * A middleware definition with all {@link Grok.Inherit} values.
 *
 * This means all values are unused and should inherit from the composition chain.
 */
export type HandlerMiddlewareDefinitionBase = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareDefinition<
    any, // HandlerMiddlewareDefinition.Inherit.Provider,
    any, // HandlerMiddlewareDefinition.Inherit.ContextInbound,
    any, // HandlerMiddlewareDefinition.Inherit.ContextOutbound,
    any, // HandlerMiddlewareDefinition.Inherit.ResponseInbound
    any // HandlerMiddlewareDefinition.Inherit.ResponseOutbound
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
      HandlerMiddlewareDefinition.Get.Provider<Definition>,
      Grok.Merge<HandlerMiddlewareDefinition.Get.ContextInbound<Definition>, HandlerMiddlewareContextPassThrough>
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
        Grok.Merge<HandlerMiddlewareDefinition.Get.ContextOutbound<Definition>, HandlerMiddlewareContextPassThrough>,
        Grok.Union<HandlerMiddlewareDefinition.Get.ResponseInbound<Definition>, HandlerMiddlewareResponsePassThrough>
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
    Grok.Union<
      HandlerMiddlewareDefinition.Get.ResponseOutbound<Definition>,
      HandlerMiddlewareResponsePassThrough
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
   * - `input.context` which is the context requested.
   * - `input.provider` which should denote the provider that called the handler.
   * - `input.next()` which resumes the composition chain. This function is described {@link HandlerMiddlewareNextFunction here}.
   */
  invoke(input: HandlerMiddlewareFunctionInputFromDefinition<Definition>): HandlerMiddlewareFunctionOutputFromDefinition<Definition>;
};
