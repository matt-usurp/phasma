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

export type HandlerMiddlewareClassImplementation<Definition extends HandlerMiddlewareDefinitionConstraint> = {
  /**
   * Invoke the middleware and transform the context or response.
   */
  invoke(input: HandlerMiddlewareFunctionInputFromDefinition<Definition>): HandlerMiddlewareFunctionOutputFromDefinition<Definition>;
};

export type HandlerMiddlewareNextFunction<
  Context extends HandlerContextConstraint,
  Response extends HandlerResponseConstraint,
> = (context: Context) => Promise<Response>;

export type HandlerMiddlewareFunctionInputFromDefinition<Definition extends HandlerMiddlewareDefinitionConstraint> = (
  & HandlerMiddlewareFunctionInputFromDefinition.WithParameters<Definition>
  & HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction<Definition>
);

export namespace HandlerMiddlewareFunctionInputFromDefinition {
  export type WithParameters<Definition extends HandlerMiddlewareDefinitionConstraint> = (
  /* eslint-disable @typescript-eslint/indent */
    HandlerFunctionInput<
      HandlerMiddlewareDefinition.Get.Provider<Definition>,
      Grok.Merge<HandlerMiddlewareDefinition.Get.ContextInbound<Definition>, HandlerMiddlewareContextPassThrough>
    >
  /* eslint-enable @typescript-eslint/indent */
  );

  export type WithNextFunction<Definition extends HandlerMiddlewareDefinitionConstraint> = {
    /**
     * A middleware function to invoke the next element in the call chain.
     * This must take in the given context and the response must be returned within the parent function.
     *
     * Note, the inherit symbols are not to be interfaced with in code directly.
     * These indicate an "unknown" possible element that might be handled in an element next in the chain.
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

export type HandlerMiddlewareFunctionOutputFromDefinition<D extends HandlerMiddlewareDefinitionConstraint> = (
/* eslint-disable @typescript-eslint/indent */
  Promise<
    Grok.Union<
      HandlerMiddlewareDefinition.Get.ResponseOutbound<D>,
      HandlerMiddlewareResponsePassThrough
    >
  >
/* eslint-enable @typescript-eslint/indent */
);
