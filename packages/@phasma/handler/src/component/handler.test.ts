import type { Grok } from '@matt-usurp/grok';
import type { Handler } from '../index';
import type { HandlerClassImplementation, HandlerDefinition, HandlerFunctionInput, HandlerFunctionInputFromDefinition, HandlerFunctionOutputFromDefinition } from './handler';
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

/**
 * {@link HandlerDefinition}
 */
export namespace Test_HandlerDefinition {
  /**
   * {@link HandlerDefinition.WithProvider}
   */
  export namespace Test_HandlerDefinition_WithProvider {
    type Case_WithoutPrevious = (
    /* eslint-disable @typescript-eslint/indent */
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerDefinition.WithProvider<TestProvider>,
          HandlerDefinition<
            TestProvider,
            Grok.Inherit,
            Grok.Inherit
          >
        >
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type Case_WithPreviousInherit = (
    /* eslint-disable @typescript-eslint/indent */
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerDefinition.WithProvider<
            TestProvider,
            HandlerDefinition<
              Grok.Inherit,
              TestContextData,
              TestResponse<TestResponseData>
            >
          >,
          HandlerDefinition<
            TestProvider,
            TestContextData,
            TestResponse<TestResponseData>
          >
        >
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type Case_WithPreviousDefined = (
    /* eslint-disable @typescript-eslint/indent */
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerDefinition.WithProvider<
            TestProvider,
            HandlerDefinition<
              HandlerProvider<HandlerProviderIdentifier<'test:another'>>,
              TestContextData,
              TestResponse<TestResponseData>
            >
          >,
          HandlerDefinition<
            TestProvider,
            TestContextData,
            TestResponse<TestResponseData>
          >
        >
      >
    /* eslint-enable @typescript-eslint/indent */
    );
  }

  /**
   * {@link HandlerDefinition.WithContext}
   */
  export namespace Test_HandlerDefinition_WithContext {
    type Case_WithoutPrevious = (
    /* eslint-disable @typescript-eslint/indent */
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerDefinition.WithContext<TestContextData>,
          HandlerDefinition<
            Grok.Inherit,
            TestContextData,
            Grok.Inherit
          >
        >
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type Case_WithPreviousInherit = (
    /* eslint-disable @typescript-eslint/indent */
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerDefinition.WithContext<
            TestContextData,
            HandlerDefinition<
              TestProvider,
              Grok.Inherit,
              TestResponse<TestResponseData>
            >
          >,
          HandlerDefinition<
            TestProvider,
            TestContextData,
            TestResponse<TestResponseData>
          >
        >
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type Case_WithPreviousDefined = (
    /* eslint-disable @typescript-eslint/indent */
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerDefinition.WithContext<
            TestContextData,
            HandlerDefinition<
              TestProvider,
              { something: unknown },
              TestResponse<TestResponseData>
            >
          >,
          HandlerDefinition<
            TestProvider,
            TestContextData,
            TestResponse<TestResponseData>
          >
        >
      >
    /* eslint-enable @typescript-eslint/indent */
    );
  }

  /**
   * {@link HandlerDefinition.WithResponse}
   */
  export namespace Test_HandlerDefinition_WithResponse {
    type Case_WithoutPrevious = (
    /* eslint-disable @typescript-eslint/indent */
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerDefinition.WithResponse<TestResponse<TestResponseData>>,
          HandlerDefinition<
            Grok.Inherit,
            Grok.Inherit,
            TestResponse<TestResponseData>
          >
        >
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type Case_WithPreviousInherit = (
    /* eslint-disable @typescript-eslint/indent */
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerDefinition.WithResponse<
            TestResponse<TestResponseData>,
            HandlerDefinition<
              TestProvider,
              TestContextData,
              Grok.Inherit
            >
          >,
          HandlerDefinition<
            TestProvider,
            TestContextData,
            TestResponse<TestResponseData>
          >
        >
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type Case_WithPreviousDefined = (
    /* eslint-disable @typescript-eslint/indent */
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerDefinition.WithResponse<
            TestResponse<TestResponseData>,
            HandlerDefinition<
              TestProvider,
              TestContextData,
              TestResponse<{ something: unknown }>
            >
          >,
          HandlerDefinition<
            TestProvider,
            TestContextData,
            TestResponse<TestResponseData>
          >
        >
      >
    /* eslint-enable @typescript-eslint/indent */
    );
  }

  /**
   * {@link HandlerDefinition.Get}
   */
  export namespace Test_HandlerDefinition_Get {
    /**
     * {@link HandlerDefinition.Get.Provider}
     */
    export namespace Test_HandlerDefinition_Get_Provider {
      type Case_Main = Grok.Assert.IsTrue<Grok.Value.IsExactly<HandlerDefinition.Get.Provider<TestDefinition>, TestProvider>>;
      type Case_Alias = Grok.Assert.IsTrue<Grok.Value.IsExactly<Handler.Definition.Get.Provider<TestDefinition>, TestProvider>>;
    }

    /**
     * {@link HandlerDefinition.Get.Context}
     */
    export namespace Test_HandlerDefinition_Get_Context {
      type Case_Main = Grok.Assert.IsTrue<Grok.Value.IsExactly<HandlerDefinition.Get.Context<TestDefinition>, TestContextData>>;
      type Case_Alias = Grok.Assert.IsTrue<Grok.Value.IsExactly<Handler.Definition.Get.Context<TestDefinition>, TestContextData>>;
    }

    /**
     * {@link HandlerDefinition.Get.Response}
     */
    export namespace Test_HandlerDefinition_Get_Response {
      type Case_Main = Grok.Assert.IsTrue<Grok.Value.IsExactly<HandlerDefinition.Get.Response<TestDefinition>, TestResponse<TestResponseData>>>;
      type Case_Alias = Grok.Assert.IsTrue<Grok.Value.IsExactly<Handler.Definition.Get.Response<TestDefinition>, TestResponse<TestResponseData>>>;
    }
  }
}

/**
 * {@link HandlerFunctionInput}
 */
export namespace Test_HandlerFunctionInput {
  type Value = HandlerFunctionInput<TestProvider, TestContextData>;

  type Case_WithProvider = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['provider'], TestProvider>>;
  type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['context'], TestContextData>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ValueAny = HandlerFunctionInput<any, any>;

  type Case_WithAnyProvider = ValueAny['provider'];
  type Case_WithAnyContext = ValueAny['context'];
}

/**
 * {@link HandlerFunctionInputFromDefinition}
 */
export namespace Test_HandlerFunctionInputFromDefinition {
  type Value = HandlerFunctionInputFromDefinition<TestDefinition>;

  type Case_WithProvider = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['provider'], TestProvider>>;
  type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['context'], TestContextData>>;
}

/**
 * {@link HandlerFunctionOutputFromDefinition}
 */
export namespace Test_HandlerFunctionOutputFromDefinition {
  type Value = HandlerFunctionOutputFromDefinition<TestDefinition>;

  type Case_WithPromise = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, Promise<TestResponse<TestResponseData>>>>;
}

/**
 * {@link HandlerClassImplementation}
 */
export namespace Test_HandlerClassImplementation {
  type Value = HandlerClassImplementation<TestDefinition>;

  type Case_WithFunction = Grok.Assert.IsTrue<Grok.Value.IsExtending<Value['handle'], Grok.Constraint.FunctionLike>>;
  type Case_WithFunctionInput = Grok.Assert.IsTrue<Grok.Value.IsExactly<Parameters<Value['handle']>, [HandlerFunctionInputFromDefinition<TestDefinition>]>>;
  type Case_WithFunctionOutput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ReturnType<Value['handle']>, HandlerFunctionOutputFromDefinition<TestDefinition>>>;
}
