import type { Grok } from '@matt-usurp/grok';
import type { HandlerProvider, HandlerProviderIdentifier } from '@phasma/handler/src/component/provider';
import type { LambdaHandlerProvider, LambdaHandlerProviderIdentifier } from './provider';

it('types', (): void => expect(true).toBeTruthy());

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @internal {@link LambdaHandlerProviderIdentifier}
 */
export namespace Test_LambdaHandlerProviderIdentifier {
  type Assert_CompatibleWithHandlerProviderIdentifierFormat = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerProviderIdentifier,
        HandlerProviderIdentifier<'aws:lambda'>
      >
    >
  );
}

/**
 * @internal {@link LambdaHandlerProvider}
 */
export namespace Test_LambdaHandlerProvider {
  type Assert_CompatibleWithHandlerProvider = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExtending<
        LambdaHandlerProvider,
        HandlerProvider<LambdaHandlerProviderIdentifier>
      >
    >
  );
}
