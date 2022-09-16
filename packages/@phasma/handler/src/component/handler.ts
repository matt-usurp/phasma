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
  Provider extends HandlerProviderConstraint | Grok.Inherit,
  Context extends HandlerContextConstraint | Grok.Inherit,
  Response extends HandlerResponseConstraint | Grok.Inherit,
> = {
  readonly HP: Provider;
  readonly HC: Context;
  readonly HR: Response;
};

/**
 * A handler definition with all {@link Grok.Inherit} values.
 *
 * This means all values are unused and should inherit from the composition chain.
 */
export type HandlerDefinitionBase = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    HandlerDefinitionInheritProvider,
    HandlerDefinitionInheritContext,
    HandlerDefinitionInheritResponse
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
 Grok.Inherit.Merge<
   HandlerDefinition<
     Provider,
     HandlerDefinitionInheritContext,
     HandlerDefinitionInheritResponse
   >,
   Definition
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
 Grok.Inherit.Merge<
   HandlerDefinition<
     HandlerDefinitionInheritProvider,
     Context,
     HandlerDefinitionInheritResponse
   >,
   Definition
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
 Grok.Inherit.Merge<
   HandlerDefinition<
     HandlerDefinitionInheritProvider,
     HandlerDefinitionInheritContext,
     Response
   >,
   Definition
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
 * Indicate the provider should be inheritted.
 */
export type HandlerDefinitionInheritProvider = Grok.Inherit;

/**
 * Indicate the context should be inheritted.
 */
export type HandlerDefinitionInheritContext = Grok.Inherit;

/**
 * Indicate the response should be inheritted.
 */
export type HandlerDefinitionInheritResponse = Grok.Inherit;

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
  readonly provider: Grok.If.IsInherit<Grok.Inherit.Normalise<Provider>, never, Provider>;

  /**
   * The {@link Context} that has been available through middleware and the base context from the {@link Provider}.
   *
   * This value will only be available should {@link Context} not be mentioned in the {@link HandlerDefinition}.
   * In that case this will be `never` and should not be used.
   */
  readonly context: Grok.If.IsInherit<Grok.Inherit.Normalise<Context>, never, Context>;
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
   * - `input.context` which is the context requested.
   * - `input.provider` which should denote the provider that called the handler.
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
   * Retrieve data from {@link Handler.Definition}.
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
   * Types that indicate a value within {@link Handler.Definition} should be inheritted.
   */
  export namespace Inherit {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Provider = handler.HandlerDefinitionInheritProvider;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Context = handler.HandlerDefinitionInheritContext;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Response = handler.HandlerDefinitionInheritResponse;
  }
}
