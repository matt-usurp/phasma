import type { Grok } from '@matt-usurp/grok';
import type { Handler } from '../index';
import type { HandlerClassImplementation, HandlerDefinition, HandlerDefinitionGetContext, HandlerDefinitionGetProvider, HandlerDefinitionGetResponse, HandlerDefinitionUseAnyContext, HandlerDefinitionUseAnyProvider, HandlerDefinitionUseAnyResponse, HandlerDefinitionWithContext, HandlerDefinitionWithProvider, HandlerDefinitionWithResponse, HandlerFunctionInput, HandlerFunctionInputFromDefinition, HandlerFunctionOutputFromDefinition } from './handler';
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
  /**
   * @internal {@link HandlerDefinition.WithProvider}
   */
  export namespace Test_HandlerDefinitionWithProvider_WithDefaultSecondParameter {
    type Value = (
      HandlerDefinitionWithProvider<TestProvider>
    );

    type ValueAssertAgainst = (
      HandlerDefinition<
        TestProvider,
        HandlerDefinitionUseAnyContext,
        HandlerDefinitionUseAnyResponse
      >
    );

    type Case_WithInherit_ReplaceWithProvider = (
      Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueAssertAgainst>>
    );
  }

  /**
   * @internal {@link HandlerDefinition.WithProvider}
   */
  export namespace Test_HandlerDefinitionWithProvider_WithInheritProvider {
    type Value = (
      HandlerDefinitionWithProvider<
        TestProvider,
        HandlerDefinition<
          HandlerDefinitionUseAnyProvider,
          HandlerDefinitionUseAnyContext,
          HandlerDefinitionUseAnyResponse
        >
      >
    );

    type ValueAssertAgainst = (
      HandlerDefinition<
        TestProvider,
        HandlerDefinitionUseAnyContext,
        HandlerDefinitionUseAnyResponse
      >
    );

    type Case_WithInherit_ReplaceWithProvider = (
      Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueAssertAgainst>>
    );
  }

  /**
   * @internal {@link HandlerDefinition.WithProvider}
   */
  export namespace Test_HandlerDefinitionWithProvider_WithSameProvider {
    type Value = (
      HandlerDefinitionWithProvider<
        TestProvider,
        HandlerDefinition<
          TestProvider,
          HandlerDefinitionUseAnyContext,
          HandlerDefinitionUseAnyResponse
        >
      >
    );

    type ValueAssertAgainst = (
      HandlerDefinition<
        TestProvider,
        HandlerDefinitionUseAnyContext,
        HandlerDefinitionUseAnyResponse
      >
    );

    type Case_WithProvider_ReplaceWithSameProvider = (
      Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueAssertAgainst>>
    );
  }

  /**
   * @internal {@link HandlerDefinition.WithProvider}
   */
  export namespace Test_HandlerDefinitionWithProvider_WithAnotherProvider {
    type Value = (
      HandlerDefinitionWithProvider<
        TestProvider,
        HandlerDefinition<
          HandlerProvider<HandlerProviderIdentifier<'test:another'>>,
          HandlerDefinitionUseAnyContext,
          HandlerDefinitionUseAnyResponse
        >
      >
    );

    type ValueAssertAgainst = (
      HandlerDefinition<
        TestProvider,
        HandlerDefinitionUseAnyContext,
        HandlerDefinitionUseAnyResponse
      >
    );

    type Case_WithInherit_ReplaceWithProvider = (
      Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueAssertAgainst>>
    );
  }
}

/**
 * @internal {@link HandlerDefinition.WithContext}
 */
export namespace Test_HandlerDefinitionWithContext {
  /**
   * @internal {@link HandlerDefinition.WithContext}
   */
  export namespace Test_HandlerDefinitionWithContext_WithDefaultSecondParameter {
    type Value = (
      HandlerDefinitionWithContext<TestContextData>
    );

    type ValueAssertAgainst = (
      HandlerDefinition<
        HandlerDefinitionUseAnyProvider,
        TestContextData,
        HandlerDefinitionUseAnyResponse
      >
    );

    type Case_WithInherit_ReplaceWithContext = (
      Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueAssertAgainst>>
    );
  }

  /**
   * @internal {@link HandlerDefinition.WithContext}
   */
  export namespace Test_HandlerDefinitionWithContext_WithInheritContext {
    type Value = (
      HandlerDefinitionWithContext<
        TestContextData,
        HandlerDefinition<
          HandlerDefinitionUseAnyProvider,
          HandlerDefinitionUseAnyContext,
          HandlerDefinitionUseAnyResponse
        >
      >
    );

    type ValueAssertAgainst = (
      HandlerDefinition<
        HandlerDefinitionUseAnyProvider,
        TestContextData,
        HandlerDefinitionUseAnyResponse
      >
    );

    type Case_WithInherit_ReplaceWithContext = (
      Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueAssertAgainst>>
    );
  }

  /**
   * @internal {@link HandlerDefinition.WithContext}
   */
  export namespace Test_HandlerDefinitionWithContext_WithSameContext {
    type Value = (
      HandlerDefinitionWithContext<
        TestContextData,
        HandlerDefinition<
          HandlerDefinitionUseAnyProvider,
          TestContextData,
          HandlerDefinitionUseAnyResponse
        >
      >
    );

    type ValueAssertAgainst = (
      HandlerDefinition<
        HandlerDefinitionUseAnyProvider,
        TestContextData,
        HandlerDefinitionUseAnyResponse
      >
    );

    type Case_WithContext_ReplaceWithSameProvider = (
      Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueAssertAgainst>>
    );
  }

  /**
   * @internal {@link HandlerDefinition.WithContext}
   */
  export namespace Test_HandlerDefinitionWithContext_WithAnotherContext {
    type Value = (
      HandlerDefinitionWithContext<
        TestContextData,
        HandlerDefinition<
          HandlerDefinitionUseAnyProvider,
          { context: 'test:context:another' },
          HandlerDefinitionUseAnyResponse
        >
      >
    );

    type ValueAssertAgainst = (
      HandlerDefinition<
        HandlerDefinitionUseAnyProvider,
        TestContextData,
        HandlerDefinitionUseAnyResponse
      >
    );

    type Case_WithInherit_ReplaceWithContext = (
      Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueAssertAgainst>>
    );
  }
}

/**
 * @internal {@link HandlerDefinition.WithResponse}
 */
export namespace Test_HandlerDefinitionWithResponse {
  /**
   * @internal {@link HandlerDefinition.WithResponse}
   */
  export namespace Test_HandlerDefinitionWithResponse_WithDefaultSecondParameter {
    type Value = (
      HandlerDefinitionWithResponse<TestResponse<TestResponseData>>
    );

    type ValueAssertAgainst = (
      HandlerDefinition<
        HandlerDefinitionUseAnyProvider,
        HandlerDefinitionUseAnyContext,
        TestResponse<TestResponseData>
      >
    );

    type Case_WithInherit_ReplaceWithResponse = (
      Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueAssertAgainst>>
    );
  }

  /**
   * @internal {@link HandlerDefinition.WithResponse}
   */
  export namespace Test_HandlerDefinitionWithResponse_WithInheritResponse {
    type Value = (
      HandlerDefinitionWithResponse<
        TestResponse<TestResponseData>,
        HandlerDefinition<
          HandlerDefinitionUseAnyProvider,
          HandlerDefinitionUseAnyContext,
          HandlerDefinitionUseAnyResponse
        >
      >
    );

    type ValueAssertAgainst = (
      HandlerDefinition<
        HandlerDefinitionUseAnyProvider,
        HandlerDefinitionUseAnyContext,
        TestResponse<TestResponseData>
      >
    );

    type Case_WithInherit_ReplaceWithResponse = (
      Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueAssertAgainst>>
    );
  }

  /**
   * @internal {@link HandlerDefinition.WithResponse}
   */
  export namespace Test_HandlerDefinitionWithResponse_WithSameContext {
    type Value = (
      HandlerDefinitionWithResponse<
        TestResponse<TestResponseData>,
        HandlerDefinition<
          HandlerDefinitionUseAnyProvider,
          HandlerDefinitionUseAnyContext,
          TestResponse<TestResponseData>
        >
      >
    );

    type ValueAssertAgainst = (
      HandlerDefinition<
        HandlerDefinitionUseAnyProvider,
        HandlerDefinitionUseAnyContext,
        TestResponse<TestResponseData>
      >
    );

    type Case_WithResponse_ReplaceWithSameProvider = (
      Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueAssertAgainst>>
    );
  }

  /**
   * @internal {@link HandlerDefinition.WithResponse}
   */
  export namespace Test_HandlerDefinitionWithResponse_WithAnotherResponse {
    type Value = (
      HandlerDefinitionWithResponse<
        TestResponse<TestResponseData>,
        HandlerDefinition<
          HandlerDefinitionUseAnyProvider,
          HandlerDefinitionUseAnyContext,
          TestResponse<{ response: 'response:another' }>
        >
      >
    );

    type ValueAssertAgainst = (
      HandlerDefinition<
        HandlerDefinitionUseAnyProvider,
        HandlerDefinitionUseAnyContext,
        TestResponse<TestResponseData>
      >
    );

    type Case_WithInherit_ReplaceWithResponse = (
      Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueAssertAgainst>>
    );
  }
}

/**
 * @internal {@link HandlerDefinitionGetProvider}
 */
export namespace Test_HandlerDefinitionGetProvider {
  /**
   * @internal {@link HandlerDefinitionGetProvider}
   */
  export namespace Test_HandlerDefinitionGetProvider {
    type Case_WithTestDefinition_CanGetProvider = (
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
    type Case_WithTestDefinition_CanGetProvider = (
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
    type Case_WithTestDefinition_CanGetContext = (
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
    type Case_WithTestDefinition_CanGetContext = (
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
    type Case_WithTestDefinition_CanGetResponse = (
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
    type Case_WithTestDefinition_CanGetResponse = (
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

    type Case_WithValue_Provider = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Value['provider'],
          TestProvider
        >
      >
    );

    type Case_WithValue_Context = (
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

    type Case_WithValue_Provider = Grok.Assert.IsNever<Value['provider']>;
    type Case_WithValue_Context = Grok.Assert.IsNever<Value['context']>;
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

    type Case_WithValue_Provider = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Value['provider'],
          TestProvider
        >
      >
    );

    type Case_WithValue_Context = (
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
          HandlerDefinitionUseAnyProvider,
          HandlerDefinitionUseAnyContext,
          HandlerDefinitionUseAnyResponse
        >
      >
    );

    type Case_WithValue_Provider = Grok.Assert.IsNever<Value['provider']>;
    type Case_WithValue_Context = Grok.Assert.IsNever<Value['context']>;
  }
}

/**
 * @internal {@link HandlerFunctionOutputFromDefinition}
 */
export namespace Test_HandlerFunctionOutputFromDefinition {
  type Value = HandlerFunctionOutputFromDefinition<TestDefinition>;

  type Case_WithValue_IsPromise = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        Value,
        Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
      >
    >
  );

  type Case_WithValue_IsHandlerResponse = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        Value,
        Promise<TestResponse<any>> // eslint-disable-line @typescript-eslint/no-explicit-any
      >
    >
  );

  type Case_WithValue_IsHandlerResponse_WithTestResponseData = (
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

  type Case_WithValue_IsFunction = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExtending<
        Value['handle'],
        Grok.Constraint.FunctionLike
      >
    >
  );

  type Case_WithValue_IsFunction_WithInput = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        Parameters<Value['handle']>,
        [HandlerFunctionInputFromDefinition<TestDefinition>]
      >
    >
  );

  type Case_WithValue_IsFunction_WithOutput = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        ReturnType<Value['handle']>,
        HandlerFunctionOutputFromDefinition<TestDefinition>
      >
    >
  );
}
