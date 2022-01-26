import type { Grok } from '@matt-usurp/grok';
import { HandlerContextConstraint } from './context';
import { HandlerFunctionParametersPayload } from './handler';
import { HandlerMiddlewareValueInheritContext, HandlerMiddlewareValueInheritResponse } from './middleware/inherit';
import { HandlerProviderConstraint } from './provider';
import { HandlerResponseConstraint } from './response';

export type HandlerMiddlewareDefinition<
  Provider extends HandlerProviderConstraint,
  ContextInbound extends HandlerContextConstraint,
  ContextOutbound extends HandlerContextConstraint,
  ResponseInbound extends HandlerResponseConstraint,
  ResponseOutbound extends HandlerResponseConstraint,
> = {
  readonly HandlerMiddlewareDefinitionProvider: Provider,
  readonly HandlerMiddlewareDefinitionContextInbound: ContextInbound,
  readonly HandlerMiddlewareDefinitionContextOutbound: ContextOutbound,
  readonly HandlerMiddlewareDefinitionResponseInbound: ResponseInbound,
  readonly HandlerMiddlewareDefinitionResponseOutbound: ResponseOutbound,
}

export namespace HandlerMiddlewareDefinition {
  export type SomeProvider = any;
  export type SomeContextInbound = any;
  export type SomeContextOutbound = any;
  export type SomeResponseInbound = any;
  export type SomeResponseOutbound = any;
}

export type HandlerMiddlewareDefinitionConstraint = (
  HandlerMiddlewareDefinition<
    HandlerMiddlewareDefinition.SomeProvider,
    HandlerMiddlewareDefinition.SomeContextInbound,
    HandlerMiddlewareDefinition.SomeContextOutbound,
    HandlerMiddlewareDefinition.SomeResponseInbound,
    HandlerMiddlewareDefinition.SomeResponseOutbound
  >
);

export type HandlerMiddlewareImplementationWithInvokeFunction<D extends HandlerMiddlewareDefinitionConstraint> = {
  /**
   * Invoke the middleware and transform the context or response.
   */
  invoke(
    input: HandlerMiddlewareFunctionParameters<D>,
  ): Promise<HandlerMiddlewareFunctionResponse<D>>;
};

export type HandlerMiddlewareNextFunction<
  Context extends HandlerContextConstraint,
  Response extends HandlerResponseConstraint
> = (context: Context) => Promise<Response>;

export type HandlerMiddlewareFunctionParameters<D extends HandlerMiddlewareDefinitionConstraint> = (
  & HandlerMiddlewareFunctionParemeters.WithParameters<D>
  & HandlerMiddlewareFunctionParemeters.WithNextFunction<D>
);

export namespace HandlerMiddlewareFunctionParemeters {
  export type WithParameters<D extends HandlerMiddlewareDefinitionConstraint> = (
    HandlerFunctionParametersPayload<
      D['HandlerMiddlewareDefinitionProvider'],
      Grok.Merge<D['HandlerMiddlewareDefinitionContextInbound'], HandlerMiddlewareValueInheritContext>
    >
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
      HandlerMiddlewareNextFunction<
        Grok.Merge<D['HandlerMiddlewareDefinitionContextOutbound'], HandlerMiddlewareValueInheritContext>,
        Grok.Union<D['HandlerMiddlewareDefinitionResponseInbound'], HandlerMiddlewareValueInheritResponse>
      >
    );
  };
}

export type HandlerMiddlewareFunctionResponse<D extends HandlerMiddlewareDefinitionConstraint> = Grok.Union<D['HandlerMiddlewareDefinitionResponseOutbound'], HandlerMiddlewareValueInheritResponse>;
