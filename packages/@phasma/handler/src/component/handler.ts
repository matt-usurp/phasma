import type { Grok } from '@matt-usurp/grok';
import type { HandlerContextConstraint } from './context';
import type { HandlerProviderConstraint } from './provider';
import type { HandlerResponseConstraint } from './response';

/**
 * A handler definition that defines the {@link Provider}, {@link Context} and {@link Response} to be used.
 *
 * These types will be enforced at build type when used with the handler composer/builder.
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

export namespace HandlerDefinition {
  export namespace Inherit {
    /**
     * Indicate the provider should be inheritted.
     */
    export type Provider = Grok.Inherit;

    /**
     * Indicate the provider should be inheritted.
     */
    export type Context = Grok.Inherit;

    /**
     * Indicate the provider should be inheritted.
     */
    export type Response = Grok.Inherit;
  }

  /**
   * @deprecated use {@link HandlerDefinition.Inherit.Provider} instead, to be removed in `>=1.1.0`
   */
  export type SomeProvider = HandlerDefinition.Inherit.Provider;

  /**
   * @deprecated use {@link HandlerDefinition.Inherit.Context} instead, to be removed in `>=1.1.0`
   */
  export type SomeContext = HandlerDefinition.Inherit.Context;

  /**
   * @deprecated use {@link HandlerDefinition.Inherit.Response} instead, to be removed in `>=1.1.0`
   */
  export type SomeResponse = HandlerDefinition.Inherit.Response;

  /**
   * Create a {@link HandlerDefinition} without a provider.
   */
  export type WithoutProvider<
    Context extends HandlerContextConstraint,
    Response extends HandlerResponseConstraint,
  > = HandlerDefinition.WithContext<Context, HandlerDefinition.WithResponse<Response>>;

  /**
   * Use the given {@link Provider} within the given {@link Definition}.
   */
  export type WithProvider<
    Provider extends HandlerProviderConstraint,
    Definition extends HandlerDefinitionConstraint = HandlerDefinitionBase,
  > = (
  /* eslint-disable @typescript-eslint/indent */
    Grok.Inherit.Merge<
      HandlerDefinition<
        Provider,
        HandlerDefinition.Inherit.Context,
        HandlerDefinition.Inherit.Response
      >,
      Definition
    >
  /* eslint-enable @typescript-eslint/indent */
  );

  /**
   * Use the given {@link Context} within the given {@link Definition}.
   */
  export type WithContext<
    Context extends HandlerContextConstraint,
    Definition extends HandlerDefinitionConstraint = HandlerDefinitionBase,
  > = (
  /* eslint-disable @typescript-eslint/indent */
    Grok.Inherit.Merge<
      HandlerDefinition<
        HandlerDefinition.Inherit.Provider,
        Context,
        HandlerDefinition.Inherit.Response
      >,
      Definition
    >
  /* eslint-enable @typescript-eslint/indent */
  );

  /**
   * Use the given {@link Response} within the given {@link Definition}.
   */
  export type WithResponse<
    Response extends HandlerResponseConstraint,
    Definition extends HandlerDefinitionConstraint = HandlerDefinitionBase,
  > = (
  /* eslint-disable @typescript-eslint/indent */
    Grok.Inherit.Merge<
      HandlerDefinition<
        HandlerDefinition.Inherit.Provider,
        HandlerDefinition.Inherit.Context,
        Response
      >,
      Definition
    >
  /* eslint-enable @typescript-eslint/indent */
  );

  /**
   * Retrieve data from the {@link HandlerDefinition}.
   */
  export namespace Get {
    /**
     * Retrieve the defined provider from {@link Definition}.
     */
    export type Provider<Definition extends HandlerDefinitionConstraint> = Definition['HP'];

    /**
     * Retrieve the handle context from {@link Definition}.
     */
    export type Context<Definition extends HandlerDefinitionConstraint> = Definition['HC'];

    /**
     * Retrieve the handler response from {@link Definition}.
     */
    export type Response<Definition extends HandlerDefinitionConstraint> = Definition['HR'];
  }
}

/**
 * A handler definition with all {@link Grok.Inherit} values.
 *
 * This means all values are unused and should inherit from the composition chain.
 */
export type HandlerDefinitionBase = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    HandlerDefinition.Inherit.Provider,
    HandlerDefinition.Inherit.Context,
    HandlerDefinition.Inherit.Response
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * A constraint type for the {@link HandlerDefinition}.
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
 * The handler function input parameters defining {@link Provider} and {@link Context}.
 */
export type HandlerFunctionInput<
  Provider extends HandlerProviderConstraint,
  Context extends HandlerContextConstraint,
> = {
  /**
   * The {@link Provider} object with any specialised metadata.
   */
  readonly provider: Provider;

  /**
   * The {@link Context} that has been available through middleware and the base context from the {@link Provider}.
   */
  readonly context: Context;
};

/**
 * The handler function input parameters resolved from the {@link Definition}.
 */
export type HandlerFunctionInputFromDefinition<Definition extends HandlerDefinitionConstraint> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerFunctionInput<
    HandlerDefinition.Get.Provider<Definition>,
    HandlerDefinition.Get.Context<Definition>
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * The handler function response resolved from the given {@link Definition}.
 */
export type HandlerFunctionOutputFromDefinition<Definition extends HandlerDefinitionConstraint> = (
  HandlerDefinition.Get.Response<Definition> extends HandlerResponseConstraint
    ? Promise<HandlerDefinition.Get.Response<Definition>>
    : never
);

/**
 * A class-based handler implementation for {@link Definition}
 */
export type HandlerClassImplementation<Definition extends HandlerDefinitionConstraint> = {
  /**
   * Handle an action using the given input parameters.
   *
   * You have access to the `{ context }` which should be as defined in the {@link Definition}.
   * You have access to the `{ provider }` which should denote the provider that called the handler.
   */
  handle(
    input: ( // The type breakdown is important here otherwise we get errors with the usage.
    /* eslint-disable @typescript-eslint/indent */
      HandlerFunctionInput<
        HandlerDefinition.Get.Provider<Definition>,
        HandlerDefinition.Get.Context<Definition>
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
