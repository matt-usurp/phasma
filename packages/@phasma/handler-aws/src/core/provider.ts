import { Grok, never } from '@matt-usurp/grok';
import type { HandlerComposition, HandlerEntrypoint, HandlerImplementationWithHandleFunction } from '@phasma/handler/src/component/handler';
import { HandlerBuilder } from '@phasma/handler/src/core/builder';
import type { Context as AwsLambdaFunctionContext } from 'aws-lambda';
import type { LambdaHandlerContextBase } from '../component/context';
import type { LambdaHandlerEventSourceIdentifiers, LambdaHandlerEventSourcePayloadFromIdentifier, LambdaHandlerEventSourceResponseFromIdentifier, LambdaHandlerEventSourceResultFromIdentifier } from '../component/event';
import type { LambdaHandlerProviderFromEventSourceIdentifier, LambdaHandlerProviderIdentifier } from '../component/provider';
import { unwrap } from '../response';

export type LambdaHandlerBuilder<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerBuilder<
    LambdaHandlerProviderFromEventSourceIdentifier<EventSourceIdentifier>,
    LambdaHandlerContextBase,
    LambdaHandlerEventSourceResponseFromIdentifier<EventSourceIdentifier>
  >
/* eslint-enable @typescript-eslint/indent */
);

export type LambdaHandlerComposition<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerComposition<
    HandlerImplementationWithHandleFunction<Grok.Constraint.Anything>,
    LambdaHandlerProviderFromEventSourceIdentifier<EventSourceIdentifier>,
    LambdaHandlerContextBase,
    LambdaHandlerEventSourceResponseFromIdentifier<EventSourceIdentifier>
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * The aws provider identifier.
 */
export const id: LambdaHandlerProviderIdentifier = 'provider:aws';

/**
 * Arguments provided to an entrypoint function via aws lambda.
 */
export type LambdaHandlerEntrypointArguments<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = [
  payload: LambdaHandlerEventSourcePayloadFromIdentifier<EventSourceIdentifier>,
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
    Promise<LambdaHandlerEventSourceResultFromIdentifier<EventSourceIdentifier>>
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * An entrypoint function that can be used to wrap the given composition from the builder.
 * This produces a function that is compatible with aws lambda.
 */
export const entrypoint = <EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers>(composition: Promise<LambdaHandlerComposition<EventSourceIdentifier>>): LambdaHandlerEntrypoint<EventSourceIdentifier> => {
  const fn: LambdaHandlerEntrypoint<EventSourceIdentifier> = async (payload, context) => {
    const result = await (await composition)({
      provider: {
        id,
        payload,
      },

      context: {
        request: {
          id: context.awsRequestId,
        },

        function: {
          arn: context.invokedFunctionArn,
          name: context.functionName,
          version: context.functionVersion,
          memory: parseInt(context.memoryLimitInMB, 10),
          ttl: () => context.getRemainingTimeInMillis(),
        },
      },
    });

    if (result.type === 'response:aws:result') {
      return unwrap(result);
    }

    if (result.type === 'response:nothing') {
      return;
    }

    throw never(result);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore Assignment to read-only property
  fn.$composition = composition;

  return fn;
};

export type LambdaHandlerBuilderCompositionFactory<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (application: LambdaHandlerBuilder<EventSourceIdentifier>) => Promise<LambdaHandlerComposition<EventSourceIdentifier>>;

/**
 * A factory that can create handler compositions using the builder functionality provided.
 * This is the recommended entrypoint for building aws handlers.
 */
export const factory = <EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers>(factory: LambdaHandlerBuilderCompositionFactory<EventSourceIdentifier>): LambdaHandlerEntrypoint<EventSourceIdentifier> => {
  const builder: LambdaHandlerBuilder<EventSourceIdentifier> = new HandlerBuilder();

  // Essentially a cache that prevents the builder from being invoked multiple times.
  // This solves the issue of the builder being invoked immediately which makes testing the entrypoint difficult.
  // Now the builder is invoked only once on the first request.
  let invoker: LambdaHandlerEntrypoint<EventSourceIdentifier> | undefined = undefined;

  return (payload, context) => {
    if (invoker === undefined) {
      invoker = entrypoint(factory(builder));
    }

    return invoker(payload, context);
  };
};
