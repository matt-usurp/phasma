import type { HandlerResponseConstraint, HandlerResponseGetValue } from '@phasma/handler/src/component/response';
import type { LambdaHandlerEventSources } from '../definition/events';

/**
 * A event source that can be used to invoke AWS Lambda.
 *
 * This is denoted by the {@link Identifier} which relates to the AWS service.
 * With that {@link Payload} and {@link Response} define the expected input and outputs.
 */
export type LambdaHandlerEventSource<
  Identifier extends string,
  Payload,
  Response extends HandlerResponseConstraint,
> = {
  readonly EI: Identifier;
  readonly EP: Payload;
  readonly ER: Response;
};

/**
 * A constraint type for {@link LambdaHandlerEventSource}.
 */
export type LambdaHandlerEventSourceConstraint = (
/* eslint-disable @typescript-eslint/indent */
  LambdaHandlerEventSource<
    string,
    any, // eslint-disable-line @typescript-eslint/no-explicit-any
    any // eslint-disable-line @typescript-eslint/no-explicit-any
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * Retrieve the event source identifier from {@link LambdaHandlerEventSource}.
 */
export type LambdaHandlerEventSourceGetIdentifier<EventSource extends LambdaHandlerEventSourceConstraint> = EventSource['EI'];

/**
 * Retrieve the event source payload from {@link LambdaHandlerEventSource}.
 */
export type LambdaHandlerEventSourceGetPayload<EventSource extends LambdaHandlerEventSourceConstraint> = EventSource['EP'];

/**
 * Retrieve the event source response from {@link LambdaHandlerEventSource}.
 */
export type LambdaHandlerEventSourceGetResponse<EventSource extends LambdaHandlerEventSourceConstraint> = EventSource['ER'];

/**
 * Retrieve the event source response value from {@link LambdaHandlerEventSource}.
 */
export type LambdaHandlerEventSourceGetResponseValue<EventSource extends LambdaHandlerEventSourceConstraint> = (
  HandlerResponseGetValue<LambdaHandlerEventSourceGetResponse<EventSource>>
);

/**
 * All available event sources within {@link LambdaHandlerEventSources}.
 *
 * Each identifier relates to a specific service within AWS that supports AWS Lambda invocation.
 */
export type LambdaHandlerEventSourceIdentifiers = keyof LambdaHandlerEventSources;

/**
 * A verification type for {@link LambdaHandlerEventSourceIdentifiers}.
 */
export type LambdaHandlerEventSourceIdentifierVerifier<Identifier extends LambdaHandlerEventSourceIdentifiers> = Identifier;

/**
 * Retrieve the {@link LambdaHandlerEventSource} for the given event source {@link Identifier}.
 */
export type LambdaHandlerEventSourceFromIdentifier<Identifier extends LambdaHandlerEventSourceIdentifiers> = LambdaHandlerEventSources[Identifier];

/**
 * Retreive the defined payload for the given event source {@link Identifier}.
 */
export type LambdaHandlerEventSourceGetPayloadFromIdentifier<Identifier extends LambdaHandlerEventSourceIdentifiers> = (
  LambdaHandlerEventSourceGetPayload<LambdaHandlerEventSourceFromIdentifier<Identifier>>
);

/**
 * Retreive the defined response for the given event source {@link Identifier}.
 */
export type LambdaHandlerEventSourceGetResponseFromIdentifier<Identifier extends LambdaHandlerEventSourceIdentifiers> = (
  LambdaHandlerEventSourceGetResponse<LambdaHandlerEventSourceFromIdentifier<Identifier>>
);

/**
 * Retreive the internal value for the defined response for the given event source {@link Identifier}.
 */
export type LambdaHandlerEventSourceGetResponseValueFromIdentifier<Identifier extends LambdaHandlerEventSourceIdentifiers> = (
  LambdaHandlerEventSourceGetResponseValue<LambdaHandlerEventSourceFromIdentifier<Identifier>>
);

/**
 * The below import(s) and namespace allows this file to compose a better developer experience through type aliasing.
 * Here we define a series of aliases that provide better naming and a single type import.
 * This is then aliased in the root file with a better name also.
 */
import * as event from './event';

/**
 * Types for defining and working with AWS Lambda event sources.
 */
export namespace LambdaHandlerEvent {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Source = event.LambdaHandlerEventSourceFromIdentifier;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Identifier = event.LambdaHandlerEventSourceIdentifierVerifier;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Identifiers = event.LambdaHandlerEventSourceIdentifiers;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Payload = event.LambdaHandlerEventSourceGetPayloadFromIdentifier;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Response = event.LambdaHandlerEventSourceGetResponseFromIdentifier;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import ResponseValue = event.LambdaHandlerEventSourceGetResponseValueFromIdentifier;
}

/*!
 * This is a developer experience namespace merge.
 * You are probably looking for the defined type instead, keep searching for another result.
 */
export namespace LambdaHandlerEventSourceFromIdentifier {
  /**
   * Retrieve data from {@link LambdaHandlerEventSource}.
   */
  export namespace Get {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Payload = event.LambdaHandlerEventSourceGetPayload;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Response = event.LambdaHandlerEventSourceGetResponse;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import ResponseValue = event.LambdaHandlerEventSourceGetResponseValue;
  }
}
