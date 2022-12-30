import { never } from '@matt-usurp/grok';
import type { EnvironmentMapping } from '@matt-usurp/grok/system/environment';
import type { HandlerContextBase } from '@phasma/handler/src/component/context';
import type { HandlerClassImplementation, HandlerComposition, HandlerEntrypoint } from '@phasma/handler/src/component/handler';
import { HandlerComposer } from '@phasma/handler/src/core/handler/composer';
import type { Context as AwsLambdaFunctionContext } from 'aws-lambda';
import type { LambdaHandlerEventSourceGetPayloadFromIdentifier, LambdaHandlerEventSourceGetResponseFromIdentifier, LambdaHandlerEventSourceGetResponseValueFromIdentifier, LambdaHandlerEventSourceIdentifiers } from '../component/event';
import type { LambdaHandlerProviderIdentifier, LambdaHandlerProviderWithEventFromEventSourceIdentifier } from '../component/provider';
import { unwrap } from '../response';

export type LambdaHandlerComposer<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerComposer<
    LambdaHandlerProviderWithEventFromEventSourceIdentifier<EventSourceIdentifier>,
    HandlerContextBase,
    LambdaHandlerEventSourceGetResponseFromIdentifier<EventSourceIdentifier>
  >
/* eslint-enable @typescript-eslint/indent */
);

export type LambdaHandlerComposition<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerComposition<
    HandlerClassImplementation<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
    LambdaHandlerProviderWithEventFromEventSourceIdentifier<EventSourceIdentifier>,
    HandlerContextBase,
    LambdaHandlerEventSourceGetResponseFromIdentifier<EventSourceIdentifier>
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * The {@link LambdaHandlerProviderIdentifier} string literal.
 */
export const id: LambdaHandlerProviderIdentifier = 'provider:aws:lambda';

/**
 * Arguments provided to an entrypoint function via aws lambda.
 */
export type LambdaHandlerEntrypointArguments<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = [
  payload: LambdaHandlerEventSourceGetPayloadFromIdentifier<EventSourceIdentifier>,
  context: AwsLambdaFunctionContext,
];

/**
 * An entrypoint function that is compatible with aws lambda.
 */
export type LambdaHandlerEntrypoint<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerEntrypoint<
    LambdaHandlerComposition<EventSourceIdentifier>,
    LambdaHandlerEntrypointArguments<EventSourceIdentifier>,
    Promise<LambdaHandlerEventSourceGetResponseValueFromIdentifier<EventSourceIdentifier>>
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * Add utilities to the {@link Entrypoint}.
 *
 * These can assist with testing by forcing parameters to be as given or reseting the internal cache.
 */
export type WithLambdaHandlerEntrypointUtilities<Entrypoint> = (
  & Entrypoint
  & {
    /**
     * Reset the internal composition cache.
     *
     * When the entrypoint is invoked (or any form of this entrypoint) the composition is cached.
     * This means that services that were constructed with the environment or other inputs will not be re-created.
     * Calling this will clear the cached composition enforcing the next execution to create the composition again.
     */
    reset: () => void;

    /**
     * Re-create the {@link Entrypoint} with the given {@link environment} instead.
     *
     * This will not clear the cached composition meaning if the entrypoint was invoked the given {@link environment} will have no effect.
     * Consider calling `.reset()` before invoking the return function to ensure your composition is created with the {@link environment} provided.
     */
    withEnvironment: (environment: EnvironmentMapping) => Entrypoint;
  }
);

/**
 * An entrypoint function that can be used to wrap the given composition from the builder.
 * This produces a function that is compatible with aws lambda.
 */
export const entrypoint = <EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers>(composition: Promise<LambdaHandlerComposition<EventSourceIdentifier>>): LambdaHandlerEntrypoint<EventSourceIdentifier> => {
  const fn: LambdaHandlerEntrypoint<EventSourceIdentifier> = async (event, context) => {
    const result = await (await composition)({
      provider: {
        id,

        function: {
          arn: context.invokedFunctionArn,
          name: context.functionName,
          version: context.functionVersion,
          memory: parseInt(context.memoryLimitInMB, 10),
          ttl: () => context.getRemainingTimeInMillis(),
        },

        logging: {
          group: context.logGroupName,
          stream: context.logStreamName,
        },

        event,
      },

      context: {
        id: context.awsRequestId,
      },
    });

    if (result.type === 'response:aws:result') {
      return unwrap(result);
    }

    if (result.type === 'response:nothing') {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw never(result);
  };

  // @ts-expect-error Assignment to read-only property
  fn.$composition = composition;

  return fn;
};

/**
 * Compose and return an {@link application} that will trigger the handler.
 * Optionally make use of the given {@link environment} to allow for testing and abstractions.
 */
export type LambdaHandlerCompositionFactory<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
  application: LambdaHandlerComposer<EventSourceIdentifier>,
  environment: EnvironmentMapping,
) => Promise<LambdaHandlerComposition<EventSourceIdentifier>>;

/**
 * A factory that can create handler compositions using the builder functionality provided.
 * This is the recommended entrypoint for building aws handlers.
 */
export const factory = <EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers>(
  composition: LambdaHandlerCompositionFactory<EventSourceIdentifier>,
): WithLambdaHandlerEntrypointUtilities<LambdaHandlerEntrypoint<EventSourceIdentifier>> => {
  const composer: LambdaHandlerComposer<EventSourceIdentifier> = new HandlerComposer();

  // Essentially a cache that prevents the builder from being invoked multiple times.
  // This solves the issue of the builder being invoked immediately which makes testing the entrypoint difficult.
  // Now the builder is invoked only once on the first request.
  let invoker: LambdaHandlerEntrypoint<EventSourceIdentifier> | undefined = undefined;

  /**
   * A handler proxy that will cache the composition.
   */
  const proxy = (environment: EnvironmentMapping): LambdaHandlerEntrypoint<EventSourceIdentifier> => async (payload, context) => {
    if (invoker === undefined) {
      invoker = entrypoint(
        composition(
          composer,
          environment,
        ),
      );
    }

    return invoker(payload, context);
  };

  /**
   * A function to reset the internal composition cache.
   */
  const reset = () => {
    invoker = undefined;
  };

  // A production-like entrypoint is created using a reference to the process environment.
  // This is cast to the utilities type which we add too before returning.
  const handler = proxy(process.env) as WithLambdaHandlerEntrypointUtilities<LambdaHandlerEntrypoint<EventSourceIdentifier>>;

  // Attach the cache reset function.
  handler.reset = () => reset();

  // Attach the custom environment factory.
  handler.withEnvironment = (environment: EnvironmentMapping): LambdaHandlerEntrypoint<EventSourceIdentifier> => proxy(environment);

  return handler;
};
