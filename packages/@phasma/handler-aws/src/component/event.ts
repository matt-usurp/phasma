import { HandlerResponseConstraint } from '@phasma/handler/src/component/response';
import { LambdaHandlerEventSources } from '../definition/events';

export type LambdaHandlerEventSource<
  EventSourceIdentifier extends string,
  EventSourcePayload,
  EventSourceResponse extends HandlerResponseConstraint,
> = {
  readonly EventSourceIdentifier: EventSourceIdentifier;
  readonly EventSourcePayload: EventSourcePayload;
  readonly EventSourceResponse: EventSourceResponse;
};

export type LambdaHandlerEventSourceConstraint = LambdaHandlerEventSource<string, any, any>;

export type LambdaHandlerEventSourceIdentifiers = keyof LambdaHandlerEventSources;
export type LambdaHandlerEventSourceFromIdentifier<Identifier extends LambdaHandlerEventSourceIdentifiers> = LambdaHandlerEventSources[Identifier];
