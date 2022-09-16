import type { HandlerContextBase, HandlerContextConstraint } from '@phasma/handler/src/component/context';
import type { HandlerDefinition } from '@phasma/handler/src/component/handler';
import type { HandlerResponseConstraint } from '@phasma/handler/src/component/response';
import type { LambdaHandlerEventSourceGetResponseFromIdentifier, LambdaHandlerEventSourceIdentifiers } from './event';
import type { LambdaHandlerProviderWithEventFromEventSourceIdentifier } from './provider';

/**
 * A tailored {@link HandlerDefinition} that is compatible with {@link LambdaHandlerEventSourceIdentifiers}.
 *
 * See {@link HandlerDefinition} for more information.
 */
export type LambdaHandlerDefinition<
  Identifier extends LambdaHandlerEventSourceIdentifiers,
  Context extends HandlerContextConstraint = HandlerContextBase,
  Response extends HandlerResponseConstraint = LambdaHandlerEventSourceGetResponseFromIdentifier<Identifier>,
> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    LambdaHandlerProviderWithEventFromEventSourceIdentifier<Identifier>,
    Context,
    Response
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * The below import(s) and namespace allows this file to compose a better developer experience through type aliasing.
 * Here we define a series of aliases that provide better naming and a single type import.
 * This is then aliased in the root file with a better name also.
 */
import * as phasma from '@phasma/handler/src/index';
import * as handler from './handler';

/**
 * Types for defining and working with handlers for AWS Lambda.
 */
export namespace LambdaHandler {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Definition = handler.LambdaHandlerDefinition;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Implementation = phasma.Handler.Implementation;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Fn = phasma.Handler.Fn;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Context = phasma.Handler.Context;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Response = phasma.Handler.Response;
}
