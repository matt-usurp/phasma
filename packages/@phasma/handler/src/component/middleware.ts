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
  readonly Provider: Provider,
  readonly ContextInbound: ContextInbound,
  readonly ContextOutbound: ContextOutbound,
  readonly ResponseInbound: ResponseInbound,
  readonly ResponseOutbound: ResponseOutbound,
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
> = (context: Context) => Response;

export type HandlerMiddlewareFunctionParameters<D extends HandlerMiddlewareDefinitionConstraint> = (
  & HandlerMiddlewareFunctionParemeters.WithParameters<D>
  & HandlerMiddlewareFunctionParemeters.WithNextFunction<D>
);

export namespace HandlerMiddlewareFunctionParemeters {
  export type WithParameters<D extends HandlerMiddlewareDefinitionConstraint> = (
    HandlerFunctionParametersPayload<
      D['Provider'],
      Grok.Merge<D['ContextInbound'], HandlerMiddlewareValueInheritContext>
    >
  );

  export type WithNextFunction<D extends HandlerMiddlewareDefinitionConstraint> = {
    readonly next: (
      HandlerMiddlewareNextFunction<
        Grok.Merge<D['ContextOutbound'], HandlerMiddlewareValueInheritContext>,
        Grok.Union<D['ResponseInbound'], HandlerMiddlewareValueInheritResponse>
      >
    );
  };
}

export type HandlerMiddlewareFunctionResponse<D extends HandlerMiddlewareDefinitionConstraint> = Grok.Union<D['ResponseOutbound'], HandlerMiddlewareValueInheritResponse>;
