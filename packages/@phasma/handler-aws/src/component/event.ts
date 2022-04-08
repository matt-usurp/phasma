import type { Grok } from '@matt-usurp/grok';
import type { HandlerResponseConstraint } from '@phasma/handler/src/component/response';
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
  LambdaHandlerEventSource<
    string,
    Grok.Constraint.Anything,
    Grok.Constraint.Anything
  >
);

export type LambdaHandlerEventSourceIdentifiers = keyof LambdaHandlerEventSources;
export type LambdaHandlerEventSourceFromIdentifier<Identifier extends LambdaHandlerEventSourceIdentifiers> = LambdaHandlerEventSources[Identifier];
