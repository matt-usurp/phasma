import type { HandlerProvider, HandlerProviderIdentifier, HandlerProviderWithPayload } from '@phasma/handler/src/component/provider';
import type { LambdaHandlerEventSourceConstraint, LambdaHandlerEventSourceFromIdentifier, LambdaHandlerEventSourceIdentifiers } from './event';

export type LambdaHandlerProviderIdentifier = HandlerProviderIdentifier<'aws'>;

export type LambdaHandlerProvider = HandlerProvider<LambdaHandlerProviderIdentifier>;

export type LambdaHandlerProviderWithPayload<Event extends LambdaHandlerEventSourceConstraint> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerProviderWithPayload<
    LambdaHandlerProviderIdentifier,
    Event
  >
/* eslint-enable @typescript-eslint/indent */
);

export type LambdaHandlerProviderFromEventSourceIdentifier<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerProviderWithPayload<
    LambdaHandlerProviderIdentifier,
    LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourcePayload']
  >
/* eslint-enable @typescript-eslint/indent */
);
