import { HandlerContextConstraint } from './context';
import { HandlerProviderConstraint } from './provider';
import { HandlerResponseConstraint } from './response';

export type HandlerDefinition<
  Provider extends HandlerProviderConstraint,
  Context extends HandlerContextConstraint,
  Response extends HandlerResponseConstraint,
> = {
  readonly HandlerDefinitionProvider: Provider;
  readonly HandlerDefinitionContext: Context;
  readonly HandlerDefinitionResponse: Response;
}

export type HandlerDefinitionConstraint = HandlerDefinition<any, any, any>;

export type HandlerFunctionParameters<Definition extends HandlerDefinitionConstraint> = (
  HandlerFunctionParametersPayload<
    Definition['HandlerDefinitionProvider'],
    Definition['HandlerDefinitionContext']
  >
);

export type HandlerFunctionParametersPayload<
  Provider extends HandlerProviderConstraint,
  Context extends HandlerContextConstraint,
> = {
  /**
   * Metadata about the provider.
   */
  readonly provider: Provider;

  /**
   * Contextual information made available through middleware and the base context from the provider.
   */
  readonly context: Context;
}

export type HandlerFunctionResponse<Definition extends HandlerDefinitionConstraint> = (
  Definition['HandlerDefinitionResponse'] extends HandlerResponseConstraint
    ? Definition['HandlerDefinitionResponse']
    : never
);

/**
 * An implementation of the handler type.
 */
export type HandlerImplementationWithHandleFunction<Definition extends HandlerDefinitionConstraint> = {
  /**
   * Handle.
   */
  handle(
    parameters: (
      HandlerFunctionParametersPayload<
        Definition['HandlerDefinitionProvider'],
        Definition['HandlerDefinitionContext']
      >
    ),
  ): Promise<HandlerFunctionResponse<Definition>>
}

export type HandlerComposition<
  HandlerInstance,
  Provider extends HandlerProviderConstraint,
  Context extends HandlerContextConstraint,
  Response extends HandlerResponseConstraint,
> = {
  readonly $handler?: HandlerInstance;

  (input: HandlerFunctionParametersPayload<Provider, Context>): Promise<Response>
};

export type HandlerEntrypoint<
  BuilderComposite,
  EntrypointArguments extends any[],
  EntrypointResponse
> = {
  readonly $composition?: BuilderComposite;

  (...args: EntrypointArguments): EntrypointResponse;
};
