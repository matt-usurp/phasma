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

  /**
   * Retrieve data from the {@link HandlerDefinition}.
   */
  export namespace Get {
    /**
     * Retrieve the defined provider.
     */
    export type Provider<D extends HandlerDefinitionConstraint> = D['HandlerDefinitionProvider'];

    /**
     * Retrieve the handle context.
     */
    export type Context<D extends HandlerDefinitionConstraint> = D['HandlerDefinitionContext'];

    /**
     * Retrieve the handler response.
     */
    export type Response<D extends HandlerDefinitionConstraint> = D['HandlerDefinitionResponse'];
  }
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

export type HandlerFunctionParameters<D extends HandlerDefinitionConstraint> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerFunctionParametersPayload<
    HandlerDefinition.Get.Provider<D>,
    HandlerDefinition.Get.Context<D>
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

export type HandlerFunctionResponse<D extends HandlerDefinitionConstraint> = (
  HandlerDefinition.Get.Response<D> extends HandlerResponseConstraint
    ? Promise<HandlerDefinition.Get.Response<D>>
    : never
);

/**
 * An implementation of the handler type.
 */
export type HandlerImplementationWithHandleFunction<D extends HandlerDefinitionConstraint> = {
  /**
   * Handle.
   */
  handle(
    parameters: (
    /* eslint-disable @typescript-eslint/indent */
      HandlerFunctionParametersPayload<
        HandlerDefinition.Get.Provider<D>,
        HandlerDefinition.Get.Context<D>
      >
    /* eslint-enable @typescript-eslint/indent */
    ),
  ): HandlerFunctionResponse<D>;
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
