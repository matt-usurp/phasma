import { Grok, never } from '@matt-usurp/grok';
import type { HandlerClassImplementation, HandlerComposition, HandlerEntrypoint } from '@phasma/handler/src/component/handler';
import { HandlerComposer } from '@phasma/handler/src/core/handler/composer';
import type { Context as AwsLambdaFunctionContext } from 'aws-lambda';
import type { LambdaHandlerContextBase } from '../component/context';
import type { LambdaHandlerEventSourceIdentifiers, LambdaHandlerEventSourcePayloadFromIdentifier, LambdaHandlerEventSourceResponseFromIdentifier, LambdaHandlerEventSourceResultFromIdentifier } from '../component/event';
import type { LambdaHandlerProviderFromEventSourceIdentifier, LambdaHandlerProviderIdentifier } from '../component/provider';
import { unwrap } from '../response';

export type LambdaHandlerComposer<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerComposer<
    LambdaHandlerProviderFromEventSourceIdentifier<EventSourceIdentifier>,
    LambdaHandlerContextBase,
    LambdaHandlerEventSourceResponseFromIdentifier<EventSourceIdentifier>
  >
/* eslint-enable @typescript-eslint/indent */
);

export type LambdaHandlerComposition<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerComposition<
    HandlerClassImplementation<Grok.Constraint.Anything>,
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

export type LambdaHandlerCompositionFactory<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (application: LambdaHandlerComposer<EventSourceIdentifier>) => Promise<LambdaHandlerComposition<EventSourceIdentifier>>;

/**
 * A factory that can create handler compositions using the builder functionality provided.
 * This is the recommended entrypoint for building aws handlers.
 */
export const factory = <EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers>(factory: LambdaHandlerCompositionFactory<EventSourceIdentifier>): LambdaHandlerEntrypoint<EventSourceIdentifier> => {
  const composer: LambdaHandlerComposer<EventSourceIdentifier> = new HandlerComposer();

  // Essentially a cache that prevents the builder from being invoked multiple times.
  // This solves the issue of the builder being invoked immediately which makes testing the entrypoint difficult.
  // Now the builder is invoked only once on the first request.
  let invoker: LambdaHandlerEntrypoint<EventSourceIdentifier> | undefined = undefined;

  return (payload, context) => {
    if (invoker === undefined) {
      invoker = entrypoint(factory(composer));
    }

    return invoker(payload, context);
  };
};
