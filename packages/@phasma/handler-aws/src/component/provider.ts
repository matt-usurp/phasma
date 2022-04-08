import type { HandlerProvider, HandlerProviderIdentifier, HandlerProviderWithPayload } from '@phasma/handler/src/component/provider';
import type { LambdaHandlerEventSourceConstraint, LambdaHandlerEventSourceFromIdentifier, LambdaHandlerEventSourceIdentifiers } from './event';

export type LambdaHandlerProviderIdentifier = HandlerProviderIdentifier<'aws'>;

export type LambdaHandlerProvider = HandlerProvider<LambdaHandlerProviderIdentifier>;

export type LambdaHandlerProviderWithPayload<Event extends LambdaHandlerEventSourceConstraint> = (
  HandlerProviderWithPayload<
    LambdaHandlerProviderIdentifier,
    Event
  >
);

export type LambdaHandlerProviderFromEventSourceIdentifier<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
  HandlerProviderWithPayload<
    LambdaHandlerProviderIdentifier,
    LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourcePayload']
  >
);
