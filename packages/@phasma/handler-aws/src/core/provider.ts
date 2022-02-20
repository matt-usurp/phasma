import { HandlerComposition, HandlerEntrypoint, HandlerImplementationWithHandleFunction } from '@phasma/handler/src/component/handler';
import { HandlerBuilder } from '@phasma/handler/src/core/builder';
import type { Context as AwsLambdaFunctionContext } from 'aws-lambda';
import { LambdaHandlerContextBase } from '../component/context';
import { LambdaHandlerEventSourceFromIdentifier, LambdaHandlerEventSourceIdentifiers } from '../component/event';
import { LambdaHandlerProviderFromEventSourceIdentifier, LambdaHandlerProviderIdentifier } from '../component/provider';

export type LambdaHandlerBuilder<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
  HandlerBuilder<
    LambdaHandlerProviderFromEventSourceIdentifier<EventSourceIdentifier>,
    LambdaHandlerContextBase,
    LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourceResponse']
  >
);

export type LambdaHandlerComposition<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
  HandlerComposition<
    HandlerImplementationWithHandleFunction<any>,
    LambdaHandlerProviderFromEventSourceIdentifier<EventSourceIdentifier>,
    LambdaHandlerContextBase,
    LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourceResponse']
  >
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
  HandlerEntrypoint<
    LambdaHandlerComposition<EventSourceIdentifier>,
    LambdaHandlerEntrypointArguments<EventSourceIdentifier>,
    Promise<LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourceResponse']>
  >
);

/**
 * An entrypoint function that can be used to wrap the given composition from the builder.
 * This produces a function that is compatible with aws lambda.
 */
export const entrypoint = <EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers>(composition: LambdaHandlerComposition<EventSourceIdentifier>): LambdaHandlerEntrypoint<EventSourceIdentifier> => {
  const fn: LambdaHandlerEntrypoint<EventSourceIdentifier> = async (payload, context) => {
    return composition({
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
  };

  // @ts-ignore Assignment to read-only property
  fn.$composition = composition;

  return fn;
}

export type LambdaHandlerBuilderCompositionFactory<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (application: LambdaHandlerBuilder<EventSourceIdentifier>) => LambdaHandlerComposition<EventSourceIdentifier>;

/**
 * A factory that can create handler compositions using the builder functionality provided.
 * This is the recommended entrypoint for building aws handlers.
 */
export const factory = <EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers>(factory: LambdaHandlerBuilderCompositionFactory<EventSourceIdentifier>): LambdaHandlerEntrypoint<EventSourceIdentifier> => {
  const builder: LambdaHandlerBuilder<EventSourceIdentifier> = new HandlerBuilder();

  return entrypoint(factory(builder));
};
