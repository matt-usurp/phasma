import type { Grok } from '@matt-usurp/grok';
import type { Handler } from '../index';
import type { HandlerClassImplementation, HandlerDefinition, HandlerDefinitionGetContext, HandlerDefinitionGetProvider, HandlerDefinitionGetResponse, HandlerDefinitionInheritContext, HandlerDefinitionInheritProvider, HandlerDefinitionInheritResponse, HandlerDefinitionWithContext, HandlerDefinitionWithProvider, HandlerDefinitionWithResponse, HandlerFunctionInput, HandlerFunctionInputFromDefinition, HandlerFunctionOutputFromDefinition } from './handler';
import type { HandlerProvider, HandlerProviderIdentifier } from './provider';
import type { HandlerResponse, HandlerResponseIdentifier } from './response';

it('types', (): void => expect(true).toBeTruthy());

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */

type TestProvider = HandlerProvider<HandlerProviderIdentifier<'test'>>;
type TestResponse<T> = HandlerResponse<HandlerResponseIdentifier<'test'>, T>;

type TestContextData = { case: 'context' };
type TestResponseData = { case: 'response' };

type TestDefinition = (
  HandlerDefinition<
    TestProvider,
    TestContextData,
    TestResponse<TestResponseData>
  >
);

/**
 * @internal {@link HandlerDefinition.WithProvider}
 */
export namespace Test_HandlerDefinitionWithProvider {
  type Assert_WithHandlerDefinitionWithSameProvider_ReplaceWithProvider = (
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
  );

  type Assert_WithHandlerDefinitionWithInherit_ReplaceWithProvider = (
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
  );

  type Assert_WithHandlerDefinitionWithAnotherProvider_ReplaceWithProvider = (
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
  );
}

/**
 * @internal {@link HandlerDefinition.WithContext}
 */
export namespace Test_HandlerDefinitionWithContext {
  type Assert_WithHandlerDefinitionWithSameContext_ReplaceWithContext = (
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
  );

  type Assert_WithHandlerDefinitionWithInherit_ReplaceWithContext = (
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
  );

  type Assert_WithHandlerDefinitionWithAnotherContext_ReplaceWithContext = (
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
  );
}

/**
 * @internal {@link HandlerDefinition.WithResponse}
 */
export namespace Test_HandlerDefinitionWithResponse {
  type Assert_WithHandlerDefinitionWithSameResponse_ReplaceWithResponse = (
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
  );

  type Assert_WithHandlerDefinitionWithInherit_ReplaceWithResponse = (
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
  );

  type Assert_WithHandlerDefinitionWithAnotherResponse_ReplaceWithResponse = (
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
  );
}

/**
 * @internal {@link HandlerDefinitionGetProvider}
 */
export namespace Test_HandlerDefinitionGetProvider {
  /**
   * @internal {@link HandlerDefinitionGetProvider}
   */
  export namespace Test_HandlerDefinitionGetProvider {
    type Assert_WithTestDefinition_CanGetProvider = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerDefinitionGetProvider<TestDefinition>,
          TestProvider
        >
      >
    );
  }

  /**
   * @internal {@link HandlerDefinition.Get.Provider}
   */
  export namespace Test_HandlerDefinitionGetProvider_UsingAlias {
    type Assert_WithTestDefinition_CanGetProvider = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Handler.Definition.Get.Provider<TestDefinition>,
          TestProvider
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerDefinitionGetContext}
 */
export namespace Test_HandlerDefinitionGetContext {
  /**
   * @internal {@link HandlerDefinitionGetContext}
   */
  export namespace Test_HandlerDefinitionGetContext {
    type Assert_WithTestDefinition_CanGetContext = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerDefinitionGetContext<TestDefinition>,
          TestContextData
        >
      >
    );
  }

  /**
   * @internal {@link Handler.Definition.Get.Context}
   */
  export namespace Test_HandlerDefinitionGetContext_UsingAlias {
    type Assert_WithTestDefinition_CanGetContext = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Handler.Definition.Get.Context<TestDefinition>,
          TestContextData
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerDefinitionGetResponse}
 */
export namespace Test_HandlerDefinitionGetResponse {
  /**
   * @internal {@link HandlerDefinitionGetResponse}
   */
  export namespace Test_HandlerDefinitionGetResponse {
    type Assert_WithTestDefinition_CanGetResponse = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerDefinitionGetResponse<TestDefinition>,
          TestResponse<TestResponseData>
        >
      >
    );
  }

  /**
   * @internal {@link Handler.Definition.Get.Response}
   */
  export namespace Test_HandlerDefinitionGetResponse_UsingAlias {
    type Assert_WithTestDefinition_CanGetResponse = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Handler.Definition.Get.Response<TestDefinition>,
          TestResponse<TestResponseData>
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerFunctionInput}
 */
export namespace Test_HandlerFunctionInput {
  /**
   * @internal {@link HandlerFunctionInput}
   */
  export namespace Test_HandlerFunctionInput {
    type Value = HandlerFunctionInput<TestProvider, TestContextData>;

    type Assert_WithValue_Provider = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Value['provider'],
          TestProvider
        >
      >
    );

    type Assert_WithValue_Context = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Value['context'],
          TestContextData
        >
      >
    );
  }

  /**
   * @internal {@link HandlerFunctionInput}
   */
  export namespace Test_HandlerFunctionInput_WithAnyValue_ResolveNever {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Value = HandlerFunctionInput<any, any>;

    type Assert_WithValue_Provider = Grok.Assert.IsNever<Value['provider']>;
    type Assert_WithValue_Context = Grok.Assert.IsNever<Value['context']>;
  }
}

/**
 * @internal {@link HandlerFunctionInputFromDefinition}
 */
export namespace Test_HandlerFunctionInputFromDefinition {
  /**
   * @internal {@link HandlerFunctionInputFromDefinition}
   */
  export namespace Test_HandlerFunctionInputFromDefinition {
    type Value = HandlerFunctionInputFromDefinition<TestDefinition>;

    type Assert_WithValue_Provider = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Value['provider'],
          TestProvider
        >
      >
    );

    type Assert_WithValue_Context = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Value['context'],
          TestContextData
        >
      >
    );
  }

  /**
   * @internal {@link HandlerFunctionInputFromDefinition}
   */
  export namespace Test_HandlerFunctionInputFromDefinition_WithInheritValue_ResolveNever {
    type Value = (
      HandlerFunctionInputFromDefinition<
        HandlerDefinition<
          HandlerDefinitionInheritProvider,
          HandlerDefinitionInheritContext,
          HandlerDefinitionInheritResponse
        >
      >
    );

    type Assert_WithValue_Provider = Grok.Assert.IsNever<Value['provider']>;
    type Assert_WithValue_Context = Grok.Assert.IsNever<Value['context']>;
  }
}

/**
 * @internal {@link HandlerFunctionOutputFromDefinition}
 */
export namespace Test_HandlerFunctionOutputFromDefinition {
  type Value = HandlerFunctionOutputFromDefinition<TestDefinition>;

  type Assert_WithValue_IsPromise = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        Value,
        Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
      >
    >
  );

  type Assert_WithValue_IsHandlerResponse = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        Value,
        Promise<TestResponse<any>> // eslint-disable-line @typescript-eslint/no-explicit-any
      >
    >
  );

  type Assert_WithValue_IsHandlerResponse_WithTestResponseData = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        Value,
        Promise<TestResponse<TestResponseData>>
      >
    >
  );
}

/**
 * @internal {@link HandlerClassImplementation}
 */
export namespace Test_HandlerClassImplementation {
  type Value = HandlerClassImplementation<TestDefinition>;

  type Assert_WithValue_IsFunction = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExtending<
        Value['handle'],
        Grok.Constraint.FunctionLike
      >
    >
  );

  type Assert_WithValue_IsFunction_WithInput = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        Parameters<Value['handle']>,
        [HandlerFunctionInputFromDefinition<TestDefinition>]
      >
    >
  );

  type Assert_WithValue_IsFunction_WithOutput = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        ReturnType<Value['handle']>,
        HandlerFunctionOutputFromDefinition<TestDefinition>
      >
    >
  );
}
