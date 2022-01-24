import { HandlerDefinition } from '@phasma/handler/src/component/handler';
import { HandlerContextBase, HandlerContextConstraint } from '../../../handler/src/component/context';
import { HandlerResponseConstraint } from '../../../handler/src/component/response';
import { LambdaHandlerEventSourceFromIdentifier, LambdaHandlerEventSourceIdentifiers } from './event';
import { LambdaHandlerProviderFromEventSourceIdentifier } from './provider';

export type LambdaHandlerDefinition<
  EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers,
  Context extends HandlerContextConstraint = HandlerContextBase,
  Response extends HandlerResponseConstraint = LambdaHandlerEventSourceFromIdentifier<EventSourceIdentifier>['EventSourceResponse'],
> = (
  HandlerDefinition<
    LambdaHandlerProviderFromEventSourceIdentifier<EventSourceIdentifier>,
    Context,
    Response
  >
);
