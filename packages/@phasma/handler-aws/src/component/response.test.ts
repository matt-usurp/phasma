import type { Grok } from '@matt-usurp/grok';
import type { HandlerResponse, HandlerResponseIdentifier } from '@phasma/handler/src/component/response';
import type { LambdaHandlerResponse, LambdaHandlerResponseIdentifier } from './response';

it('types', (): void => expect(true).toBeTruthy());

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @internal {@link LambdaHandlerResponseIdentifier}
 */
export namespace Test_LambdaHandlerResponseIdentifier {
  type Assert_CompatibleWithHandlerResponseIdentifierFormat = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerResponseIdentifier,
        HandlerResponseIdentifier<'aws:result'>
      >
    >
  );
}

/**
 * @internal {@link LambdaHandlerResponse}
 */
export namespace Test_LambdaHandlerResponse {
  type Assert_CompatibleWithHandlerResponse = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerResponse<undefined>,
        HandlerResponse<LambdaHandlerResponseIdentifier, undefined>
      >
    >
  );
}
