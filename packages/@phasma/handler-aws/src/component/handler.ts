import type { HandlerContextBase, HandlerContextConstraint } from '@phasma/handler/src/component/context';
import type { HandlerDefinition } from '@phasma/handler/src/component/handler';
import type { HandlerResponseConstraint } from '@phasma/handler/src/component/response';
import type { LambdaHandlerEventSourceIdentifiers, LambdaHandlerEventSourceResponseFromIdentifier } from './event';
import type { LambdaHandlerProviderFromEventSourceIdentifier } from './provider';

export type LambdaHandlerDefinition<
  EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers,
  Context extends HandlerContextConstraint = HandlerContextBase,
  Response extends HandlerResponseConstraint = LambdaHandlerEventSourceResponseFromIdentifier<EventSourceIdentifier>,
> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    LambdaHandlerProviderFromEventSourceIdentifier<EventSourceIdentifier>,
    Context,
    Response
  >
/* eslint-enable @typescript-eslint/indent */
);
