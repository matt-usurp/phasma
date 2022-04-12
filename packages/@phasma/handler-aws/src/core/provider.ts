import { Grok, never } from '@matt-usurp/grok';
import type { HandlerComposition, HandlerEntrypoint, HandlerImplementationWithHandleFunction } from '@phasma/handler/src/component/handler';
import { HandlerResponseUnwrapped } from '@phasma/handler/src/component/response';
import { HandlerBuilder } from '@phasma/handler/src/core/builder';
import type { Context as AwsLambdaFunctionContext } from 'aws-lambda';
import type { LambdaHandlerContextBase } from '../component/context';
import type { LambdaHandlerEventSourceFromIdentifier, LambdaHandlerEventSourceIdentifiers } from '../component/event';
import type { LambdaHandlerProviderFromEventSourceIdentifier, LambdaHandlerProviderIdentifier } from '../component/provider';
import { unwrap } from '../response';

export type LambdaHandlerBuilder<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerBuilder<
    LambdaHandlerProviderFromEventSourceIdentifier<EventSourceIdentifier>,
    LambdaHandlerContextBase,
    LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourceResponse']
  >
/* eslint-enable @typescript-eslint/indent */
);

export type LambdaHandlerComposition<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerComposition<
    HandlerImplementationWithHandleFunction<Grok.Constraint.Anything>,
    LambdaHandlerProviderFromEventSourceIdentifier<EventSourceIdentifier>,
    LambdaHandlerContextBase,
    LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourceResponse']
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
  payload: LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourcePayload'],
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
    Promise<HandlerResponseUnwrapped<LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourceResponse']>>
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
export const factory = <EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers>(builder: LambdaHandlerBuilderCompositionFactory<EventSourceIdentifier>): LambdaHandlerEntrypoint<EventSourceIdentifier> => {
  const hb: LambdaHandlerBuilder<EventSourceIdentifier> = new HandlerBuilder();

  return entrypoint(builder(hb));
};
