import type { Grok } from '@matt-usurp/grok';
import type { HandlerContextConstraint } from './context';
import type { HandlerFunctionParametersPayload } from './handler';
import type { HandlerMiddlewareContextPassThrough, HandlerMiddlewareResponsePassThrough } from './middleware/inherit';
import type { HandlerProviderConstraint } from './provider';
import type { HandlerResponseConstraint } from './response';

export type HandlerMiddlewareDefinition<
  Provider extends HandlerProviderConstraint,
  ContextInbound extends HandlerContextConstraint,
  ContextOutbound extends HandlerContextConstraint,
  ResponseInbound extends HandlerResponseConstraint,
  ResponseOutbound extends HandlerResponseConstraint,
> = {
  readonly HandlerMiddlewareDefinitionProvider: Provider;
  readonly HandlerMiddlewareDefinitionContextInbound: ContextInbound;
  readonly HandlerMiddlewareDefinitionContextOutbound: ContextOutbound;
  readonly HandlerMiddlewareDefinitionResponseInbound: ResponseInbound;
  readonly HandlerMiddlewareDefinitionResponseOutbound: ResponseOutbound;
};

export namespace HandlerMiddlewareDefinition {
  export type SomeProvider = Grok.Constraint.Anything;
  export type SomeContextInbound = Grok.Constraint.Anything;
  export type SomeContextOutbound = Grok.Constraint.Anything;
  export type SomeResponseInbound = Grok.Constraint.Anything;
  export type SomeResponseOutbound = Grok.Constraint.Anything;
}

export type HandlerMiddlewareDefinitionConstraint = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareDefinition<
    HandlerMiddlewareDefinition.SomeProvider,
    HandlerMiddlewareDefinition.SomeContextInbound,
    HandlerMiddlewareDefinition.SomeContextOutbound,
    HandlerMiddlewareDefinition.SomeResponseInbound,
    HandlerMiddlewareDefinition.SomeResponseOutbound
  >
/* eslint-enable @typescript-eslint/indent */
);

export type HandlerMiddlewareImplementationWithInvokeFunction<D extends HandlerMiddlewareDefinitionConstraint> = {
  /**
   * Invoke the middleware and transform the context or response.
   */
  invoke(
    input: HandlerMiddlewareFunctionParameters<D>,
  ): HandlerMiddlewareFunctionResponse<D>;
};

export type HandlerMiddlewareNextFunction<
  Context extends HandlerContextConstraint,
  Response extends HandlerResponseConstraint,
> = (context: Context) => Promise<Response>;

export type HandlerMiddlewareFunctionParameters<D extends HandlerMiddlewareDefinitionConstraint> = (
  & HandlerMiddlewareFunctionParemeters.WithParameters<D>
  & HandlerMiddlewareFunctionParemeters.WithNextFunction<D>
);

export namespace HandlerMiddlewareFunctionParemeters {
  export type WithParameters<D extends HandlerMiddlewareDefinitionConstraint> = (
  /* eslint-disable @typescript-eslint/indent */
    HandlerFunctionParametersPayload<
      D['HandlerMiddlewareDefinitionProvider'],
      Grok.Merge<D['HandlerMiddlewareDefinitionContextInbound'], HandlerMiddlewareContextPassThrough>
    >
  /* eslint-enable @typescript-eslint/indent */
  );

  export type WithNextFunction<D extends HandlerMiddlewareDefinitionConstraint> = {
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
        Grok.Merge<D['HandlerMiddlewareDefinitionContextOutbound'], HandlerMiddlewareContextPassThrough>,
        Grok.Union<D['HandlerMiddlewareDefinitionResponseInbound'], HandlerMiddlewareResponsePassThrough>
      >
    /* eslint-enable @typescript-eslint/indent */
    );
  };
}

export type HandlerMiddlewareFunctionResponse<D extends HandlerMiddlewareDefinitionConstraint> = Promise<Grok.Union<D['HandlerMiddlewareDefinitionResponseOutbound'], HandlerMiddlewareResponsePassThrough>>;
