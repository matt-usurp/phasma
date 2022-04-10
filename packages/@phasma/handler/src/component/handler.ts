import type { Grok } from '@matt-usurp/grok';
import type { HandlerContextConstraint } from './context';
import type { HandlerProviderConstraint } from './provider';
import type { HandlerResponseConstraint } from './response';

export type HandlerDefinition<
  Provider extends HandlerProviderConstraint,
  Context extends HandlerContextConstraint,
  Response extends HandlerResponseConstraint,
> = {
  readonly HandlerDefinitionProvider: Provider;
  readonly HandlerDefinitionContext: Context;
  readonly HandlerDefinitionResponse: Response;
};

export namespace HandlerDefinition {
  export type SomeProvider = Grok.Constraint.Anything;
  export type SomeContext = Grok.Constraint.Anything;
  export type SomeResponse = Grok.Constraint.Anything;
}

export type HandlerDefinitionConstraint = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    Grok.Constraint.Anything,
    Grok.Constraint.Anything,
    Grok.Constraint.Anything
  >
/* eslint-enable @typescript-eslint/indent */
);

export type HandlerFunctionParameters<Definition extends HandlerDefinitionConstraint> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerFunctionParametersPayload<
    Definition['HandlerDefinitionProvider'],
    Definition['HandlerDefinitionContext']
  >
/* eslint-enable @typescript-eslint/indent */
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
};

export type HandlerFunctionResponse<Definition extends HandlerDefinitionConstraint> = (
  Definition['HandlerDefinitionResponse'] extends HandlerResponseConstraint
    ? Promise<Definition['HandlerDefinitionResponse']>
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
    /* eslint-disable @typescript-eslint/indent */
      HandlerFunctionParametersPayload<
        Definition['HandlerDefinitionProvider'],
        Definition['HandlerDefinitionContext']
      >
    /* eslint-enable @typescript-eslint/indent */
    ),
  ): HandlerFunctionResponse<Definition>;
};

export type HandlerComposition<
  HandlerInstance,
  Provider extends HandlerProviderConstraint,
  Context extends HandlerContextConstraint,
  Response extends HandlerResponseConstraint,
> = {
  readonly $handler?: HandlerInstance;

  (input: HandlerFunctionParametersPayload<Provider, Context>): Promise<Response>;
};

export type HandlerEntrypoint<
  BuilderComposite,
  EntrypointArguments extends Grok.Constraint.Anything[],
  EntrypointResponse,
> = {
  readonly $composition?: BuilderComposite;

  (...args: EntrypointArguments): EntrypointResponse;
};
