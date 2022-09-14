import type { Handler } from '../index';
import type { HandlerDefinition } from './handler';
import type { HandlerProvider, HandlerProviderIdentifier } from './provider';
import type { HandlerResponse, HandlerResponseIdentifier } from './response';

/* eslint-disable @typescript-eslint/no-unused-vars */

it('ignored, only type tests', (): void => {
  expect(true).toStrictEqual(true);
});

/**
 * @ignore
 */
export namespace Test_Component_Handler {
  type TestProviderIdentifier = HandlerProviderIdentifier<'test'>;
  type TestProvider = HandlerProvider<TestProviderIdentifier>;

  type TestResponseIdentifier = HandlerResponseIdentifier<'test'>;
  type TestResponse<T> = HandlerResponse<TestResponseIdentifier, T>;

  type TestContextData = { case: 'context' };
  type TestResponseData = { case: 'response' };

  type TestDefinition = (
  /* eslint-disable @typescript-eslint/indent */
    HandlerDefinition<
      TestProvider,
      TestContextData,
      TestResponse<TestResponseData>
    >
  /* eslint-enable @typescript-eslint/indent */
  );

  export namespace Definition_Get_Provider {
    type Test<T extends TestProvider> = T;
    type Case_Main = Test<HandlerDefinition.Get.Provider<TestDefinition>>;
    type Case_Alias = Test<Handler.Definition.Get.Provider<TestDefinition>>;
  }

  export namespace Definition_Get_Context {
    type Test<T extends TestContextData> = T;
    type Case_Main = Test<HandlerDefinition.Get.Context<TestDefinition>>;
    type Case_Alias = Test<Handler.Definition.Get.Context<TestDefinition>>;
  }

  export namespace Definition_Get_Response {
    type Test<T extends TestResponse<TestResponseData>> = T;
    type Case_Main = Test<HandlerDefinition.Get.Response<TestDefinition>>;
    type Case_Alias = Test<Handler.Definition.Get.Response<TestDefinition>>;
  }
}
