import type { Grok } from '@matt-usurp/grok';
import type { HandlerContextBase } from '@phasma/handler/src/component/context';
import type { HandlerDefinition } from '@phasma/handler/src/component/handler';
import type { HandlerResponsePresetNothing } from '@phasma/handler/src/component/response';
import type { LambdaHandlerDefinition } from './handler';
import type { LambdaHandlerProviderWithEventFromEventSourceIdentifier } from './provider';

it('types', (): void => expect(true).toBeTruthy());

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @internal {@link LambdaHandlerDefinition}
 */
export namespace Test_LambdaHandlerDefinition {
  type Assert_FromEventIdentifier_CludWatchLog = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerDefinition<'cloudwatch:log'>,
        HandlerDefinition<
          LambdaHandlerProviderWithEventFromEventSourceIdentifier<'cloudwatch:log'>,
          HandlerContextBase,
          HandlerResponsePresetNothing
        >
      >
    >
  );
}
