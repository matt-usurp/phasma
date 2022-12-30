import type { Grok } from '@matt-usurp/grok';
import type { HandlerResponse, HandlerResponseIdentifier, HandlerResponsePresetNothing } from '@phasma/handler/src/component/response';
import type { LambdaHandlerEventSource, LambdaHandlerEventSourceFromIdentifier, LambdaHandlerEventSourceGetIdentifier, LambdaHandlerEventSourceGetPayload, LambdaHandlerEventSourceGetPayloadFromIdentifier, LambdaHandlerEventSourceGetResponse, LambdaHandlerEventSourceGetResponseFromIdentifier, LambdaHandlerEventSourceGetResponseValue, LambdaHandlerEventSourceGetResponseValueFromIdentifier, LambdaHandlerEventSourceIdentifiers, LambdaHandlerEventSourceIdentifierVerifier } from './event';

it('types', (): void => expect(true).toBeTruthy());

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */

type TestLambdaHandlerEventSourceOne = (
  LambdaHandlerEventSource<
    'identifier:event:one',
    'payload:event:one',
    HandlerResponse<HandlerResponseIdentifier<'event:one'>, 'response:value:one'>
  >
);

type TestLambdaHandlerEventSourceTwo = (
  LambdaHandlerEventSource<
    'identifier:event:two',
    'payload:event:two',
    HandlerResponse<HandlerResponseIdentifier<'event:two'>, 'response:value:two'>
  >
);

/**
 * @internal {@link LambdaHandlerEventSourceGetIdentifier}
 */
export namespace Test_LambdaHandlerEventSourceGetIdentifier {
  type Assert_WithTestLambdaHandlerEventSourceOne_CanGetIdentifier = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerEventSourceGetIdentifier<TestLambdaHandlerEventSourceOne>,
        'identifier:event:one'
      >
    >
  );

  type Assert_WithTestLambdaHandlerEventSourceTwo_CanGetIdentifier = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerEventSourceGetIdentifier<TestLambdaHandlerEventSourceTwo>,
        'identifier:event:two'
      >
    >
  );
}

/**
 * @internal {@link LambdaHandlerEventSourceGetPayload}
 */
export namespace Test_LambdaHandlerEventSourceGetPayload {
  type Assert_WithTestLambdaHandlerEventSourceOne_CanGetPayload = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerEventSourceGetPayload<TestLambdaHandlerEventSourceOne>,
        'payload:event:one'
      >
    >
  );

  type Assert_WithTestLambdaHandlerEventSourceTwo_CanGetPayload = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerEventSourceGetPayload<TestLambdaHandlerEventSourceTwo>,
        'payload:event:two'
      >
    >
  );
}

/**
 * @internal {@link LambdaHandlerEventSourceGetResponse}
 */
export namespace Test_LambdaHandlerEventSourceGetResponse {
  type Assert_WithTestLambdaHandlerEventSourceOne_CanGetPayload = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerEventSourceGetResponse<TestLambdaHandlerEventSourceOne>,
        HandlerResponse<HandlerResponseIdentifier<'event:one'>, 'response:value:one'>
      >
    >
  );

  type Assert_WithTestLambdaHandlerEventSourceTwo_CanGetPayload = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerEventSourceGetResponse<TestLambdaHandlerEventSourceTwo>,
        HandlerResponse<HandlerResponseIdentifier<'event:two'>, 'response:value:two'>
      >
    >
  );
}

/**
 * @internal {@link LambdaHandlerEventSourceGetResponseValue}
 */
export namespace Test_LambdaHandlerEventSourceGetResponseValue {
  type Assert_WithTestLambdaHandlerEventSourceOne_CanGetPayload = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerEventSourceGetResponseValue<TestLambdaHandlerEventSourceOne>,
        'response:value:one'
      >
    >
  );

  type Assert_WithTestLambdaHandlerEventSourceTwo_CanGetPayload = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerEventSourceGetResponseValue<TestLambdaHandlerEventSourceTwo>,
        'response:value:two'
      >
    >
  );
}

/**
 * @internal {@link LambdaHandlerEventSourceIdentifiers}
 */
export namespace Test_LambdaHandlerEventSourceIdentifiers {
  type Assert_ContainsEventIdentifier_ApiGatewayProxy = Grok.Assert<LambdaHandlerEventSourceIdentifiers, 'apigw:proxy:v2'>;
  type Assert_ContainsEventIdentifier_CloudWatchLog = Grok.Assert<LambdaHandlerEventSourceIdentifiers, 'cloudwatch:log'>;
  type Assert_ContainsEventIdentifier_Lex = Grok.Assert<LambdaHandlerEventSourceIdentifiers, 'lex'>;
  type Assert_ContainsEventIdentifier_SQS = Grok.Assert<LambdaHandlerEventSourceIdentifiers, 'sqs'>;
}

/**
 * @internal {@link LambdaHandlerEventSourceIdentifierVerifier}
 */
export namespace Test_LambdaHandlerEventSourceIdentifierVerifier {
  type Assert_VerifyEventIdentifier_ApiGatewayProxy = Grok.Assert.IsTrue<Grok.Value.IsExactly<LambdaHandlerEventSourceIdentifierVerifier<'apigw:proxy:v2'>, 'apigw:proxy:v2'>>;
  type Assert_VerifyEventIdentifier_CloudWatchLog = Grok.Assert.IsTrue<Grok.Value.IsExactly<LambdaHandlerEventSourceIdentifierVerifier<'cloudwatch:log'>, 'cloudwatch:log'>>;
  type Assert_VerifyEventIdentifier_Lex = Grok.Assert.IsTrue<Grok.Value.IsExactly<LambdaHandlerEventSourceIdentifierVerifier<'lex'>, 'lex'>>;
  type Assert_VerifyEventIdentifier_SQS = Grok.Assert.IsTrue<Grok.Value.IsExactly<LambdaHandlerEventSourceIdentifierVerifier<'sqs'>, 'sqs'>>;

  // @ts-expect-error Identifier should belong to definitions
  type Assert_VerifyEventIdentifier_Invalid = LambdaHandlerEventSourceIdentifierVerifier<'invalid'>;
}

/**
 * @internal {@link LambdaHandlerEventSourceFromIdentifier}
 */
export namespace Test_LambdaHandlerEventSourceFromIdentifier {
  type Assert_FromEventIdentifier_ApiGatewayProxy = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExtending<
        LambdaHandlerEventSourceFromIdentifier<'apigw:proxy:v2'>,
        LambdaHandlerEventSource<
          'apigw:proxy:v2',
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          any // eslint-disable-line @typescript-eslint/no-explicit-any
        >
      >
    >
  );

  type Assert_FromEventIdentifier_CloudWatchLog = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExtending<
        LambdaHandlerEventSourceFromIdentifier<'cloudwatch:log'>,
        LambdaHandlerEventSource<
          'cloudwatch:log',
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          any // eslint-disable-line @typescript-eslint/no-explicit-any
        >
      >
    >
  );

  // @ts-expect-error Identifier should belong to definitions
  type Assert_FromEventIdentifier_Invalid = LambdaHandlerEventSourceFromIdentifier<'invalid'>;
}

/**
 * @internal {@link LambdaHandlerEventSourceGetPayloadFromIdentifier}
 */
export namespace Test_LambdaHandlerEventSourceGetPayloadFromIdentifier {
  type Assert_FromEventIdentifier_CludWatchLog = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerEventSourceGetPayloadFromIdentifier<'cloudwatch:log'>,
        { awslogs: { data: string } }
      >
    >
  );
}

/**
 * @internal {@link LambdaHandlerEventSourceGetResponseFromIdentifier}
 */
export namespace Test_LambdaHandlerEventSourceGetResponseFromIdentifier {
  type Assert_FromEventIdentifier_CludWatchLog = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerEventSourceGetResponseFromIdentifier<'cloudwatch:log'>,
        HandlerResponsePresetNothing
      >
    >
  );
}

/**
 * @internal {@link LambdaHandlerEventSourceGetResponseValueFromIdentifier}
 */
export namespace Test_LambdaHandlerEventSourceGetResponseValueFromIdentifier {
  type Assert_FromEventIdentifier_CludWatchLog = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        LambdaHandlerEventSourceGetResponseValueFromIdentifier<'cloudwatch:log'>,
        undefined
      >
    >
  );
}
