import type { Grok } from '@matt-usurp/grok';
import type { HandlerResponseConstraint, HandlerResponseUnwrapped } from '@phasma/handler/src/component/response';
import type { LambdaHandlerEventSources } from '../definition/events';

export type LambdaHandlerEventSource<
  EventSourceIdentifier extends string,
  EventSourcePayload,
  EventSourceResponse extends HandlerResponseConstraint,
> = {
  readonly EventSourceIdentifier: EventSourceIdentifier;
  readonly EventSourcePayload: EventSourcePayload;
  readonly EventSourceResponse: EventSourceResponse;
};

export type LambdaHandlerEventSourceConstraint = (
/* eslint-disable @typescript-eslint/indent */
  LambdaHandlerEventSource<
    string,
    Grok.Constraint.Anything,
    Grok.Constraint.Anything
  >
/* eslint-enable @typescript-eslint/indent */
);

export type LambdaHandlerEventSourceIdentifiers = keyof LambdaHandlerEventSources;
export type LambdaHandlerEventSourceIdentifierVerifier<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = EventSourceIdentifier;

export type LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = LambdaHandlerEventSources[EventSourceIdentifier];

export type LambdaHandlerEventSourcePayloadFromIdentifier<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourcePayload'];
export type LambdaHandlerEventSourceResponseFromIdentifier<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourceResponse'];

export type LambdaHandlerEventSourceResultFromIdentifier<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
  HandlerResponseUnwrapped<LambdaHandlerEventSourceResponseFromIdentifier<EventSourceIdentifier>>
);
