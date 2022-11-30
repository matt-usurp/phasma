import type { Grok } from '@matt-usurp/grok';
import type { HandlerContextConstraint } from './context';
import type { HandlerProviderConstraint } from './provider';
import type { HandlerResponseConstraint } from './response';

/**
 * A handler definition that defines the {@link Provider}, {@link Context} and {@link Response} to be used.
 *
 * These types will be enforced at build time when used with the handler composer.
 * These types can be satisfied through implementing middleware or are provided as a base from the {@link Provider}.
 */
export type HandlerDefinition<
  Provider extends HandlerProviderConstraint | HandlerDefinitionUseAnyProvider,
  Context extends HandlerContextConstraint | HandlerDefinitionUseAnyContext,
  Response extends HandlerResponseConstraint | HandlerDefinitionUseAnyResponse,
> = {
  readonly HP: Provider;
  readonly HC: Context;
  readonly HR: Response;
};

/**
 * A handler definition with all "any" or "inherit" values.
 *
 * This means all values are unused and should inherit from the composition chain.
 */
export type HandlerDefinitionBase = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    HandlerDefinitionUseAnyProvider,
    HandlerDefinitionUseAnyContext,
    HandlerDefinitionUseAnyResponse
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * A constraint type for {@link HandlerDefinition}.
 */
export type HandlerDefinitionConstraint = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    any, // eslint-disable-line @typescript-eslint/no-explicit-any
    any, // eslint-disable-line @typescript-eslint/no-explicit-any
    any // eslint-disable-line @typescript-eslint/no-explicit-any
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * Create a {@link HandlerDefinition} without a provider.
 */
export type HandlerDefinitionWithoutProvider<
  Context extends HandlerContextConstraint,
  Response extends HandlerResponseConstraint,
> = HandlerDefinitionWithContext<Context, HandlerDefinitionWithResponse<Response>>;

/**
 * Use the given {@link Provider} within the given {@link Definition}.
 */
export type HandlerDefinitionWithProvider<
  Provider extends HandlerProviderConstraint,
  Definition extends HandlerDefinitionConstraint = HandlerDefinitionBase,
> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    Grok.If<
      Grok.Or<[
        Grok.Value.IsAny<Provider>,
        Grok.Value.IsExactly<Provider, HandlerDefinitionUseAnyProvider>,
      ]>,
      HandlerDefinitionGetProvider<Definition>,
      Provider
    >,
    HandlerDefinitionGetContext<Definition>,
    HandlerDefinitionGetResponse<Definition>
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * Use the given {@link Context} within {@link Definition}.
 */
export type HandlerDefinitionWithContext<
  Context extends HandlerContextConstraint,
  Definition extends HandlerDefinitionConstraint = HandlerDefinitionBase,
> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    HandlerDefinitionGetProvider<Definition>,
    Grok.If<
      Grok.Or<[
        Grok.Value.IsAny<Context>,
        Grok.Value.IsExactly<Context, HandlerDefinitionUseAnyContext>,
      ]>,
      HandlerDefinitionGetContext<Definition>,
      Context
    >,
    HandlerDefinitionGetResponse<Definition>
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * Use the given {@link Response} within the given {@link Definition}.
 */
export type HandlerDefinitionWithResponse<
  Response extends HandlerResponseConstraint,
  Definition extends HandlerDefinitionConstraint = HandlerDefinitionBase,
> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    HandlerDefinitionGetProvider<Definition>,
    HandlerDefinitionGetContext<Definition>,
    Grok.If<
      Grok.Or<[
        Grok.Value.IsAny<Response>,
        Grok.Value.IsExactly<Response, HandlerDefinitionUseAnyResponse>,
      ]>,
      HandlerDefinitionGetResponse<Definition>,
      Response
    >
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * Retrieve the handler provider from {@link Definition}.
 */
export type HandlerDefinitionGetProvider<Definition extends HandlerDefinitionConstraint> = Definition['HP'];

/**
 * Retrieve the handler context from {@link Definition}.
 */
export type HandlerDefinitionGetContext<Definition extends HandlerDefinitionConstraint> = Definition['HC'];

/**
 * Retrieve the handler response from {@link Definition}.
 */
export type HandlerDefinitionGetResponse<Definition extends HandlerDefinitionConstraint> = Definition['HR'];

/**
 * A unique symbol used for type purposes to indicate "any provider"
 * This could also be considered "inherit from parent".
 */
const HandlerDefinitionAnyProviderMarker = Symbol();

/**
 * A type that indicates "any provider" or "inherit from parent".
 */
export type HandlerDefinitionUseAnyProvider = typeof HandlerDefinitionAnyProviderMarker;

/**
 * A unique symbol used for type purposes to indicate "any context"
 * This could also be considered "inherit from parent".
 */
const HandlerDefinitionAnyContextMarker = Symbol();

/**
 * A type that indicates "any context" or "inherit from parent".
 */
export type HandlerDefinitionUseAnyContext = typeof HandlerDefinitionAnyContextMarker;

/**
 * A unique symbol used for type purposes to indicate "any response"
 * This could also be considered "inherit from parent".
 */
const HandlerDefinitionAnyResponseMarker = Symbol();

/**
 * A type that indicates "any response" or "inherit from parent".
 */
export type HandlerDefinitionUseAnyResponse = typeof HandlerDefinitionAnyResponseMarker;

/**
 * The handler function input parameters defining {@link Provider} and {@link Context}.
 */
export type HandlerFunctionInput<
  Provider extends HandlerProviderConstraint,
  Context extends HandlerContextConstraint,
> = {
  /**
   * The {@link Provider} object with any specialised metadata.
   *
   * This value will only be available should {@link Provider} not be mentioned in the {@link HandlerDefinition}.
   * In that case this will be `never` and should not be used.
   */
  readonly provider: (
  /* eslint-disable @typescript-eslint/indent */
    Grok.If<
      Grok.Or<[
        Grok.Value.IsAny<Provider>,
        Grok.Value.IsExactly<Provider, HandlerDefinitionUseAnyProvider>,
      ]>,
      never,
      Provider
    >
  /* eslint-enable @typescript-eslint/indent */
  );

  /**
   * The {@link Context} that has been available through middleware and the base context from the {@link Provider}.
   *
   * This value will only be available should {@link Context} not be mentioned in the {@link HandlerDefinition}.
   * In that case this will be `never` and should not be used.
   */
  readonly context: (
  /* eslint-disable @typescript-eslint/indent */
    Grok.If<
      Grok.Or<[
        Grok.Value.IsAny<Context>,
        Grok.Value.IsExactly<Context, HandlerDefinitionUseAnyContext>,
      ]>,
      never,
      Context
    >
  /* eslint-enable @typescript-eslint/indent */
  );
};

/**
 * The handler function input parameters resolved from {@link Definition}.
 */
export type HandlerFunctionInputFromDefinition<Definition extends HandlerDefinitionConstraint> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerFunctionInput<
    HandlerDefinitionGetProvider<Definition>,
    HandlerDefinitionGetContext<Definition>
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * The handler function response resolved from {@link Definition}.
 */
export type HandlerFunctionOutputFromDefinition<Definition extends HandlerDefinitionConstraint> = (
  HandlerDefinitionGetResponse<Definition> extends HandlerResponseConstraint
    ? Promise<HandlerDefinitionGetResponse<Definition>>
    : never
);

/**
 * A class-based handler implementation for {@link Definition}
 */
export type HandlerClassImplementation<Definition extends HandlerDefinitionConstraint> = {
  /**
   * Handle an action with the given input parameters.
   *
   * You have access to the following input data, resolved from the {@link Definition}.
   *
   * - `input.context` is the context requested.
   * - `input.provider` is provider that called the handler.
   */
  handle(
    input: ( //
    /* eslint-disable @typescript-eslint/indent */
      HandlerFunctionInput<
        // We are resolving the input manually here as using the `FromDefinition` version causes type errors.
        // My thinking is that the type system has better resolution with this method over the helper class.
        // Either way, this works and can become a refactor point in the future.
        HandlerDefinitionGetProvider<Definition>,
        HandlerDefinitionGetContext<Definition>
      >
    /* eslint-enable @typescript-eslint/indent */
    ),
  ): HandlerFunctionOutputFromDefinition<Definition>;
};

/**
 * A handler composition function.
 *
 * This represents a composed middleware chain with a handler function at the end.
 * When executed middleware are invoked in the order they are defined, followed by the handler.
 * The response from the handler passes back through the middleware in reverse order before being returned from this.
 */
export type HandlerComposition<
  Handler,
  Provider extends HandlerProviderConstraint,
  Context extends HandlerContextConstraint,
  Response extends HandlerResponseConstraint,
> = {
  readonly $handler?: Handler;

  /**
   * Invoke the composition and middleware chain.
   */
  (input: HandlerFunctionInput<Provider, Context>): Promise<Response>;
};

/**
 * A handler entrypoint function.
 *
 * This represents the entrypoint function that matches the signature of the providers expected entrypoint.
 * For example, with AWS Lambda the entrypoint signature should match the Lambda handler function signature.
 */
export type HandlerEntrypoint<
  HandlerComposition,
  EntrypointArguments extends any[], // eslint-disable-line @typescript-eslint/no-explicit-any
  EntrypointResponse,
> = {
  /**
   * The raw composition that was created.
   * This exists for debug purposes mainly.
   */
  readonly $composition?: HandlerComposition;

  /**
   * Invoke the composition with the given {@link EntrypointArguments}.
   * The expected response should be {@link EntrypointResponse}.
   */
  (...args: EntrypointArguments): EntrypointResponse;
};

/**
 * The below import(s) and namespace allows this file to compose a better developer experience through type aliasing.
 * Here we define a series of aliases that provide better naming and a single type import.
 * This is then aliased in the root file with a better name also.
 */
import * as context from './context';
import * as handler from './handler';
import * as response from './response';

/**
 * Types for defining and working with handlers.
 */
export namespace Handler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Definition = handler.HandlerDefinition;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Implementation = handler.HandlerClassImplementation;

  /**
   * Types for working with the handler function signature.
   */
  export namespace Fn {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Input = handler.HandlerFunctionInputFromDefinition;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Output = handler.HandlerFunctionOutputFromDefinition;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Context = context.HandlerContextBase;

  /**
   * Shortcut to preset {@link response.HandlerResponse HandlerResponse} types.
   *
   * @deprecated use {@link response.HandlerResponse Response} directly, to be removed in `>=1.1.0`
   */
  export namespace Response {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Nothing = response.HandlerResponse.Nothing;
  }
}

/*!
 * This is a developer experience namespace merge.
 * You are probably looking for the defined type instead, keep searching for another result.
 */
export namespace HandlerDefinition {
  /**
   * Retrieve data from {@link HandlerDefinition}.
   */
  export namespace Get {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Provider = handler.HandlerDefinitionGetProvider;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Context = handler.HandlerDefinitionGetContext;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Response = handler.HandlerDefinitionGetResponse;
  }

  /**
   * Types that indicate a value within {@link HandlerDefinition} should be inheritted.
   * This is typically used when your code doesn't care about a value.
   */
  export namespace Inherit {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Provider = handler.HandlerDefinitionUseAnyProvider;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Context = handler.HandlerDefinitionUseAnyContext;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Response = handler.HandlerDefinitionUseAnyResponse;
  }
}
