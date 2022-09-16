import type { Grok } from '@matt-usurp/grok';
import type { Handler } from '../index';
import type { HandlerClassImplementation, HandlerDefinition, HandlerDefinitionGetContext, HandlerDefinitionGetProvider, HandlerDefinitionGetResponse, HandlerDefinitionWithContext, HandlerDefinitionWithProvider, HandlerDefinitionWithResponse, HandlerFunctionInput, HandlerFunctionInputFromDefinition, HandlerFunctionOutputFromDefinition } from './handler';
import type { HandlerProvider, HandlerProviderIdentifier } from './provider';
import type { HandlerResponse, HandlerResponseIdentifier } from './response';

it('ignored, only type tests', (): void => {
  expect(true).toStrictEqual(true);
});

/* eslint-disable @typescript-eslint/no-unused-vars */

type TestProvider = HandlerProvider<HandlerProviderIdentifier<'test'>>;
type TestResponse<T> = HandlerResponse<HandlerResponseIdentifier<'test'>, T>;

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
 * {@link HandlerDefinition.WithProvider}
 */
export namespace Test_HandlerDefinitionWithProvider {
  type Case_WithoutPrevious = (
  /* eslint-disable @typescript-eslint/indent */
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        HandlerDefinitionWithProvider<TestProvider>,
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
        HandlerDefinitionWithProvider<
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
        HandlerDefinitionWithProvider<
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
export namespace Test_HandlerDefinitionWithContext {
  type Case_WithoutPrevious = (
  /* eslint-disable @typescript-eslint/indent */
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        HandlerDefinitionWithContext<TestContextData>,
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
        HandlerDefinitionWithContext<
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
        HandlerDefinitionWithContext<
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
export namespace Test_HandlerDefinitionWithResponse {
  type Case_WithoutPrevious = (
  /* eslint-disable @typescript-eslint/indent */
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        HandlerDefinitionWithResponse<TestResponse<TestResponseData>>,
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
        HandlerDefinitionWithResponse<
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
        HandlerDefinitionWithResponse<
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
 * {@link HandlerDefinitionGetProvider}
 */
export namespace Test_HandlerDefinitionGetProvider {
  /**
   * {@link HandlerDefinitionGetProvider}
   */
  export namespace Test_HandlerDefinitionGetProvider {
    type Case_WithProvider = Grok.Assert.IsTrue<Grok.Value.IsExactly<HandlerDefinitionGetProvider<TestDefinition>, TestProvider>>;
  }

  /**
   * {@link HandlerDefinition.Get.Provider}
   */
  export namespace Test_HandlerDefinitionGetProvider_UsingAlias {
    type Case_WithProvider = Grok.Assert.IsTrue<Grok.Value.IsExactly<Handler.Definition.Get.Provider<TestDefinition>, TestProvider>>;
  }
}

/**
 * {@link HandlerDefinitionGetContext}
 */
export namespace Test_HandlerDefinitionGetContext {
  /**
   * {@link HandlerDefinitionGetContext}
   */
  export namespace Test_HandlerDefinitionGetContext {
    type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<HandlerDefinitionGetContext<TestDefinition>, TestContextData>>;
  }

  /**
   * {@link Handler.Definition.Get.Context}
   */
  export namespace Test_HandlerDefinitionGetContext_UsingAlias {
    type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<Handler.Definition.Get.Context<TestDefinition>, TestContextData>>;
  }
}

/**
 * {@link HandlerDefinitionGetResponse}
 */
export namespace Test_HandlerDefinitionGetResponse {
  /**
   * {@link HandlerDefinitionGetResponse}
   */
  export namespace Test_HandlerDefinitionGetResponse {
    type Case_WithResponse = Grok.Assert.IsTrue<Grok.Value.IsExactly<HandlerDefinitionGetResponse<TestDefinition>, TestResponse<TestResponseData>>>;
  }

  /**
   * {@link Handler.Definition.Get.Response}
   */
  export namespace Test_HandlerDefinitionGetResponse_UsingAlias {
    type Case_WithResponse = Grok.Assert.IsTrue<Grok.Value.IsExactly<Handler.Definition.Get.Response<TestDefinition>, TestResponse<TestResponseData>>>;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Case_WithPromise = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, Promise<any>>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Case_WithResponseWrapper = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, Promise<TestResponse<any>>>>;
  type Case_WithResponseData = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, Promise<TestResponse<TestResponseData>>>>;
}

/**
 * {@link HandlerClassImplementation}
 */
export namespace Test_HandlerClassImplementation {
  type Value = HandlerClassImplementation<TestDefinition>;

  type Case_WithFunction = Grok.Assert.IsTrue<Grok.Value.IsExtending<Value['handle'], Grok.Constraint.FunctionLike>>;

  type ValueInput = Parameters<Value['handle']>;
  type Case_WithFunctionInput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueInput, [HandlerFunctionInputFromDefinition<TestDefinition>]>>;

  type ValueOutput = ReturnType<Value['handle']>;
  type Case_WithFunctionOutput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueOutput, HandlerFunctionOutputFromDefinition<TestDefinition>>>;
}
