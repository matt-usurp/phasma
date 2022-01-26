import { HandlerContextConstraint } from './context';
import { HandlerProviderConstraint } from './provider';
import { HandlerResponseConstraint } from './response';

export type HandlerDefinition<
  Provider extends HandlerProviderConstraint,
  Context extends HandlerContextConstraint,
  Response extends HandlerResponseConstraint,
> = {
  readonly Provider: Provider;
  readonly Context: Context;
  readonly Response: Response;
}

export type HandlerDefinitionConstraint = HandlerDefinition<any, any, any>;

export type HandlerFunctionParameters<Definition extends HandlerDefinitionConstraint> = (
  HandlerFunctionParametersPayload<
    Definition['Provider'],
    Definition['Context']
  >
);

export type HandlerFunctionParametersPayload<
  Provider extends HandlerProviderConstraint,
  Context extends HandlerContextConstraint,
> = {
  readonly provider: Provider;
  readonly context: Context;
}

export type HandlerFunctionResponse<Definition extends HandlerDefinitionConstraint> = Definition['Response'];

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
