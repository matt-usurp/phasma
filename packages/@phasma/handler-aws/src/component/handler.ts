import type { HandlerDefinition } from '@phasma/handler/src/component/handler';
import type { HandlerContextBase, HandlerContextConstraint } from '../../../handler/src/component/context';
import type { HandlerResponseConstraint } from '../../../handler/src/component/response';
import type { LambdaHandlerEventSourceFromIdentifier, LambdaHandlerEventSourceIdentifiers } from './event';
import type { LambdaHandlerProviderFromEventSourceIdentifier } from './provider';

export type LambdaHandlerDefinition<
  EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers,
  Context extends HandlerContextConstraint = HandlerContextBase,
  Response extends HandlerResponseConstraint = LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourceResponse'],
> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    LambdaHandlerProviderFromEventSourceIdentifier<EventSourceIdentifier>,
    Context,
    Response
  >
/* eslint-enable @typescript-eslint/indent */
);
