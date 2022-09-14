import type { Grok } from '@matt-usurp/grok';
import type { Middleware } from '../index';
import type { HandlerMiddlewareDefinition } from './middleware';
import type { HandlerProvider, HandlerProviderIdentifier } from './provider';
import type { HandlerResponse, HandlerResponseIdentifier } from './response';

it('ignored, only type tests', (): void => {
  expect(true).toStrictEqual(true);
});

/* eslint-disable @typescript-eslint/no-unused-vars */

type TestProviderIdentifier = HandlerProviderIdentifier<'test'>;
type TestProvider = HandlerProvider<TestProviderIdentifier>;

type TestResponseIdentifier = HandlerResponseIdentifier<'test'>;
type TestResponse<T> = HandlerResponse<TestResponseIdentifier, T>;

type TestContextInbound = { case: 'context:inbound' };
type TestContextOutbound = { case: 'context:outbound' };

type TestResponseInbound = { case: 'response:inbound' };
type TestResponseOutbound = { case: 'response:outbound' };

type TestDefinition = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareDefinition<
    TestProvider,
    TestContextInbound,
    TestContextOutbound,
    TestResponse<TestResponseInbound>,
    TestResponse<TestResponseOutbound>
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * {@link HandlerMiddlewareDefinition}
 */
export namespace Test_HandlerMiddlewareDefinition {
  /**
   * {@link HandlerMiddlewareDefinition.Get.Provider}
   */
  export namespace Test_HandlerMiddlewareDefinition_Get_Provider {
    type Case_Main = Grok.Assert.IsTrue<Grok.Value.IsExactly<HandlerMiddlewareDefinition.Get.Provider<TestDefinition>, TestProvider>>;
    type Case_Alias = Grok.Assert.IsTrue<Grok.Value.IsExactly<Middleware.Definition.Get.Provider<TestDefinition>, TestProvider>>;
  }

  /**
   * {@link HandlerMiddlewareDefinition.Get.ContextInbound}
   */
  export namespace Test_HandlerMiddlewareDefinition_Get_ContextInbound {
    type Case_Main = Grok.Assert.IsTrue<Grok.Value.IsExactly<HandlerMiddlewareDefinition.Get.ContextInbound<TestDefinition>, TestContextInbound>>;
    type Case_Alias = Grok.Assert.IsTrue<Grok.Value.IsExactly<Middleware.Definition.Get.ContextInbound<TestDefinition>, TestContextInbound>>;
  }

  /**
   * {@link HandlerMiddlewareDefinition.Get.ContextOutbound}
   */
  export namespace Test_HandlerMiddlewareDefinition_Get_ContextOutbound {
    type Case_Main = Grok.Assert.IsTrue<Grok.Value.IsExactly<HandlerMiddlewareDefinition.Get.ContextOutbound<TestDefinition>, TestContextOutbound>>;
    type Case_Alias = Grok.Assert.IsTrue<Grok.Value.IsExactly<Middleware.Definition.Get.ContextOutbound<TestDefinition>, TestContextOutbound>>;
  }

  /**
   * {@link HandlerMiddlewareDefinition.Get.ResponseInbound}
   */
  export namespace Test_HandlerMiddlewareDefinition_Get_ResponseInbound {
    type Case_Main = Grok.Assert.IsTrue<Grok.Value.IsExactly<HandlerMiddlewareDefinition.Get.ResponseInbound<TestDefinition>, TestResponse<TestResponseInbound>>>;
    type Case_Alias = Grok.Assert.IsTrue<Grok.Value.IsExactly<Middleware.Definition.Get.ResponseInbound<TestDefinition>, TestResponse<TestResponseInbound>>>;
  }

  /**
   * {@link HandlerMiddlewareDefinition.Get.ResponseOutbound}
   */
  export namespace Test_HandlerMiddlewareDefinition_Get_ResponseOutbound {
    type Case_Main = Grok.Assert.IsTrue<Grok.Value.IsExactly<HandlerMiddlewareDefinition.Get.ResponseOutbound<TestDefinition>, TestResponse<TestResponseOutbound>>>;
    type Case_Alias = Grok.Assert.IsTrue<Grok.Value.IsExactly<Middleware.Definition.Get.ResponseOutbound<TestDefinition>, TestResponse<TestResponseOutbound>>>;
  }
}
