import type { Middleware } from '../index';
import type { HandlerMiddlewareDefinition } from './middleware';
import type { HandlerProvider, HandlerProviderIdentifier } from './provider';
import type { HandlerResponse, HandlerResponseIdentifier } from './response';

it('ignored, only type tests', (): void => {
  expect(true).toStrictEqual(true);
});

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @ignore
 */
export namespace Test_Component_Middleware {
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

  export namespace Definition_Get_Provider {
    type Test<T extends TestProvider> = T;
    type Case_Main = Test<HandlerMiddlewareDefinition.Get.Provider<TestDefinition>>;
    type Case_Alias = Test<Middleware.Definition.Get.Provider<TestDefinition>>;
  }

  export namespace Definition_Get_ContextInbound {
    type Test<T extends TestContextInbound> = T;
    type Case_Main = Test<HandlerMiddlewareDefinition.Get.ContextInbound<TestDefinition>>;
    type Case_Alias = Test<Middleware.Definition.Get.ContextInbound<TestDefinition>>;
  }

  export namespace Definition_Get_ContextOutbound {
    type Test<T extends TestContextOutbound> = T;
    type Case_Main = Test<HandlerMiddlewareDefinition.Get.ContextOutbound<TestDefinition>>;
    type Case_Alias = Test<Middleware.Definition.Get.ContextOutbound<TestDefinition>>;
  }

  export namespace Definition_Get_ResponseInbound {
    type Test<T extends TestResponse<TestResponseInbound>> = T;
    type Case_Main = Test<HandlerMiddlewareDefinition.Get.ResponseInbound<TestDefinition>>;
    type Case_Alias = Test<Middleware.Definition.Get.ResponseInbound<TestDefinition>>;
  }

  export namespace Definition_Get_ResponseOutbound {
    type Test<T extends TestResponse<TestResponseOutbound>> = T;
    type Case_Main = Test<HandlerMiddlewareDefinition.Get.ResponseOutbound<TestDefinition>>;
    type Case_Alias = Test<Middleware.Definition.Get.ResponseOutbound<TestDefinition>>;
  }
}
