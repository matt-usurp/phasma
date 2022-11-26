import type { Grok } from '@matt-usurp/grok';
import type { Middleware } from '../index';
import type { HandlerMiddlewareClassImplementation, HandlerMiddlewareDefinition, HandlerMiddlewareDefinitionBase, HandlerMiddlewareDefinitionGetContextInbound, HandlerMiddlewareDefinitionGetContextOutbound, HandlerMiddlewareDefinitionGetProvider, HandlerMiddlewareDefinitionGetResponseInbound, HandlerMiddlewareDefinitionGetResponseOutbound, HandlerMiddlewareDefinitionUseAnyContextInbound, HandlerMiddlewareDefinitionUseAnyContextOutbound, HandlerMiddlewareDefinitionUseAnyProvider, HandlerMiddlewareDefinitionUseAnyResponseInbound, HandlerMiddlewareFunctionInputFromDefinition, HandlerMiddlewareFunctionOutputFromDefinition, HandlerMiddlewareNextFunction } from './middleware';
import type { HandlerMiddlewareContextPassThrough, HandlerMiddlewareResponsePassThrough } from './middleware/inherit';
import type { HandlerProvider, HandlerProviderIdentifier } from './provider';
import type { HandlerResponse, HandlerResponseIdentifier } from './response';

it('types', (): void => expect(true).toBeTruthy());

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */

type TestProvider = HandlerProvider<HandlerProviderIdentifier<'test'>>;
type TestResponse<T> = HandlerResponse<HandlerResponseIdentifier<'test'>, T>;

type TestContextInbound = { case: 'context:inbound' };
type TestContextOutbound = { case: 'context:outbound' };

type TestResponseInbound = { case: 'response:inbound' };
type TestResponseOutbound = { case: 'response:outbound' };

type TestDefinition = (
  HandlerMiddlewareDefinition<
    TestProvider,
    TestContextInbound,
    TestContextOutbound,
    TestResponse<TestResponseInbound>,
    TestResponse<TestResponseOutbound>
  >
);

/**
 * @internal {@link HandlerMiddlewareDefinitionGetProvider}
 */
export namespace Test_HandlerMiddlewareDefinitionGetProvider {
  /**
   * @internal {@link HandlerMiddlewareDefinitionGetProvider}
   */
  export namespace Test_HandlerMiddlewareDefinitionGetProvider {
    type Case_WithMiddlewareDefinition_CanGetProvider = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerMiddlewareDefinitionGetProvider<TestDefinition>,
          TestProvider
        >
      >
    );
  }

  /**
   * @internal {@link Middleware.Definition.Get.Provider}
   */
  export namespace Test_HandlerMiddlewareDefinitionGetProvider {
    type Case_WithMiddlewareDefinition_CanGetProvider = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Middleware.Definition.Get.Provider<TestDefinition>,
          TestProvider
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerMiddlewareDefinitionGetContextInbound}
 */
export namespace Test_HandlerMiddlewareDefinitionGetContextInbound {
  /**
   * @internal {@link HandlerMiddlewareDefinitionGetContextInbound}
   */
  export namespace Test_HandlerMiddlewareDefinitionGetContextInbound {
    type Case_WithMiddlewareDefinition_CanGetContextInbound = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerMiddlewareDefinitionGetContextInbound<TestDefinition>,
          TestContextInbound
        >
      >
    );
  }

  /**
   * @internal {@link Middleware.Definition.Get.ContextInbound}
   */
  export namespace Test_HandlerMiddlewareDefinitionGetContextInbound {
    type Case_WithMiddlewareDefinition_CanGetContextInbound = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Middleware.Definition.Get.ContextInbound<TestDefinition>,
          TestContextInbound
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerMiddlewareDefinitionGetContextOutbound}
 */
export namespace Test_HandlerMiddlewareDefinitionGetContextOutbound {
  /**
   * @internal {@link HandlerMiddlewareDefinitionGetContextOutbound}
   */
  export namespace Test_HandlerMiddlewareDefinitionGetContextOutbound {
    type Case_WithMiddlewareDefinition_CanGetContextOutbound = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerMiddlewareDefinitionGetContextOutbound<TestDefinition>,
          TestContextOutbound
        >
      >
    );
  }

  /**
   * @internal {@link Middleware.Definition.Get.ContextOutbound}
   */
  export namespace Test_HandlerMiddlewareDefinitionGetContextOutbound {
    type Case_WithMiddlewareDefinition_CanGetContextOutbound = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Middleware.Definition.Get.ContextOutbound<TestDefinition>,
          TestContextOutbound
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerMiddlewareDefinitionGetResponseInbound}
 */
export namespace Test_HandlerMiddlewareDefinitionGetResponseInbound {
  /**
   * @internal {@link HandlerMiddlewareDefinitionGetResponseInbound}
   */
  export namespace Test_HandlerMiddlewareDefinitionGetResponseInbound {
    type Case_WithMiddlewareDefinition_CanGetResponseInbound = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerMiddlewareDefinitionGetResponseInbound<TestDefinition>,
          TestResponse<TestResponseInbound>
        >
      >
    );
  }

  /**
   * @internal {@link Middleware.Definition.Get.ResponseInbound}
   */
  export namespace Test_HandlerMiddlewareDefinitionGetResponseInbound {
    type Case_WithMiddlewareDefinition_CanGetResponseInbound = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Middleware.Definition.Get.ResponseInbound<TestDefinition>,
          TestResponse<TestResponseInbound>
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerMiddlewareDefinitionGetResponseOutbound}
 */
export namespace Test_HandlerMiddlewareDefinitionGetResponseOutbound {
  /**
   * @internal {@link HandlerMiddlewareDefinitionGetResponseOutbound}
   */
  export namespace Test_HandlerMiddlewareDefinitionGetResponseOutbound {
    type Case_WithMiddlewareDefinition_CanGetResponseOutbound = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerMiddlewareDefinitionGetResponseOutbound<TestDefinition>,
          TestResponse<TestResponseOutbound>
        >
      >
    );
  }

  /**
   * @internal {@link Middleware.Definition.Get.ResponseOutbound}
   */
  export namespace Test_HandlerMiddlewareDefinitionGetResponseOutbound {
    type Case_WithMiddlewareDefinition_CanGetResponseOutbound = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Middleware.Definition.Get.ResponseOutbound<TestDefinition>,
          TestResponse<TestResponseOutbound>
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerMiddlewareNextFunction}
 */
export namespace Test_HandlerMiddlewareNextFunction {
  type Value = (
    HandlerMiddlewareNextFunction<
      TestContextOutbound,
      TestResponse<TestResponseInbound>
    >
  );

  type Case_IsFunction = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExtending<
        Value,
        Grok.Constraint.FunctionLike
      >
    >
  );

  type Case_IsFunction_WithInput = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        Parameters<Value>,
        [TestContextOutbound]
      >
    >
  );

  type Case_IsFunction_WithOutput = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        ReturnType<Value>,
        Promise<TestResponse<TestResponseInbound>>
      >
    >
  );
}

/**
 * @internal {@link HandlerMiddlewareFunctionInputFromDefinition}
 */
export namespace Test_HandlerMiddlewareFunctionInputFromDefinition {
  /**
   * @internal {@link HandlerMiddlewareFunctionInputFromDefinition}
   */
  export namespace Test_HandlerMiddlewareFunctionInputFromDefinition {
    type Value = HandlerMiddlewareFunctionInputFromDefinition<TestDefinition>;

    type Case_WithValue_ContainsProvider = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Value['provider'],
          TestProvider
        >
      >
    );

    type Case_WithValue_ContainsContext = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Value['context'],
          TestContextInbound & HandlerMiddlewareContextPassThrough
        >
      >
    );

    type Case_WithValue_ContainsNextFunction = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExtending<
          Value['next'],
          Grok.Constraint.FunctionLike
        >
      >
    );
  }

  /**
   * @internal {@link HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput}
   */
  export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithHandlerInput {
    /**
     * @internal {@link HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithHandlerInput_WithProviderAndContext {
      type Value = HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput<TestDefinition>;

      type Case_WithValue_ContainsProvider = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExactly<
            Value['provider'],
            TestProvider
          >
        >
      );

      type Case_WithValue_ContainsContext = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExactly<
            Value['context'],
            TestContextInbound & HandlerMiddlewareContextPassThrough
          >
        >
      );
    }

    /**
     * @internal {@link HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithHandlerInput_WithoutProvider {
      type Value = (
        HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput<
          HandlerMiddlewareDefinition<
            HandlerMiddlewareDefinitionUseAnyProvider,
            TestContextInbound,
            TestContextOutbound,
            TestResponse<TestResponseInbound>,
            TestResponse<TestResponseOutbound>
          >
        >
      );

      type Case_WithValue_Provider = Grok.Assert.IsNever<Value['provider']>;
      type Case_WithValue_Context = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExactly<
            Value['context'],
            TestContextInbound & HandlerMiddlewareContextPassThrough
          >
        >
      );
    }

    /**
     * @internal {@link HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithHandlerInput_WithoutContext {
      type Value = (
        HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput<
          HandlerMiddlewareDefinition<
            TestProvider,
            HandlerMiddlewareDefinitionUseAnyContextInbound,
            TestContextOutbound,
            TestResponse<TestResponseInbound>,
            TestResponse<TestResponseOutbound>
          >
        >
      );

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
            HandlerMiddlewareContextPassThrough
          >
        >
      );
    }

    /**
     * @internal {@link HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithHandlerInput_WithoutProviderAndContext {
      type Value = (
        HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput<
          HandlerMiddlewareDefinition<
            HandlerMiddlewareDefinitionUseAnyProvider,
            HandlerMiddlewareDefinitionUseAnyContextInbound,
            TestContextOutbound,
            TestResponse<TestResponseInbound>,
            TestResponse<TestResponseOutbound>
          >
        >
      );

      type Case_WithValue_Provider = Grok.Assert.IsNever<Value['provider']>;
      type Case_WithValue_Context = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExactly<
            Value['context'],
            HandlerMiddlewareContextPassThrough
          >
        >
      );
    }
  }

  /**
   * @internal {@link HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction}
   */
  export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithNextFunction {
    /**
     * @internal {@link HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithNextFunction_WithContextAndResponse {
      type Value = HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction<TestDefinition>;

      type Case_IsFunction = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExtending<
            Value['next'],
            Grok.Constraint.FunctionLike
          >
        >
      );

      type Case_IsFunction_WithInput = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExactly<
            Parameters<Value['next']>,
            [TestContextOutbound & HandlerMiddlewareContextPassThrough]
          >
        >
      );

      type Case_IsFunction_WithOutput = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExactly<
            ReturnType<Value['next']>,
            Promise<TestResponse<TestResponseInbound> | HandlerMiddlewareResponsePassThrough>
          >
        >
      );
    }

    /**
     * @internal {@link HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithNextFunction_WithoutContext {
      type Value = (
        HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction<
          HandlerMiddlewareDefinition<
            TestProvider,
            TestContextInbound,
            HandlerMiddlewareDefinitionUseAnyContextOutbound,
            TestResponse<TestResponseInbound>,
            TestResponse<TestResponseOutbound>
          >
        >
      );

      type Case_IsFunction = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExtending<
            Value['next'],
            Grok.Constraint.FunctionLike
          >
        >
      );

      type Case_IsFunction_WithInput = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExactly<
            Parameters<Value['next']>,
            [HandlerMiddlewareContextPassThrough]
          >
        >
      );

      type Case_IsFunction_WithOutput = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExactly<
            ReturnType<Value['next']>,
            Promise<TestResponse<TestResponseInbound> | HandlerMiddlewareResponsePassThrough>
          >
        >
      );
    }

    /**
     * @internal {@link HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithNextFunction_WithoutResponse {
      type Value = HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction<
        HandlerMiddlewareDefinition<
          TestProvider,
          TestContextInbound,
          TestContextOutbound,
          HandlerMiddlewareDefinitionUseAnyResponseInbound,
          TestResponse<TestResponseOutbound>
        >
      >;

      type Case_IsFunction = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExtending<
            Value['next'],
            Grok.Constraint.FunctionLike
          >
        >
      );

      type Case_IsFunction_WithInput = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExactly<
            Parameters<Value['next']>,
            [TestContextOutbound & HandlerMiddlewareContextPassThrough]
          >
        >
      );

      type Case_IsFunction_WithOutput = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExactly<
            ReturnType<Value['next']>,
            Promise<HandlerMiddlewareResponsePassThrough>
          >
        >
      );
    }

    /**
     * @internal {@link HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithNextFunction_WithoutContextAndResponse {
      type Value = (
        HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction<
          HandlerMiddlewareDefinition<
            TestProvider,
            TestContextInbound,
            HandlerMiddlewareDefinitionUseAnyContextOutbound,
            HandlerMiddlewareDefinitionUseAnyResponseInbound,
            TestResponse<TestResponseOutbound>
          >
        >
      );

      type Case_IsFunction = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExtending<
            Value['next'],
            Grok.Constraint.FunctionLike
          >
        >
      );

      type Case_IsFunction_WithInput = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExactly<
            Parameters<Value['next']>,
            [HandlerMiddlewareContextPassThrough]
          >
        >
      );

      type Case_IsFunction_WithOutput = (
        Grok.Assert.IsTrue<
          Grok.Value.IsExactly<
            ReturnType<Value['next']>,
            Promise<HandlerMiddlewareResponsePassThrough>
          >
        >
      );
    }
  }
}

/**
 * @internal {@link HandlerMiddlewareFunctionOutputFromDefinition}
 */
export namespace Test_HandlerMiddlewareFunctionOutputFromDefinition {
  /**
   * @internal {@link HandlerMiddlewareFunctionOutputFromDefinition}
   */
  export namespace Test_HandlerMiddlewareFunctionOutputFromDefinition_WithResponse {
    type Value = HandlerMiddlewareFunctionOutputFromDefinition<TestDefinition>;

    type Case_WithOutput_IsPromise = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Value,
          Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
        >
      >
    );

    type Case_WithOutput_WithPassThrough = (
      Grok.Assert<
        Value,
        Promise<HandlerMiddlewareResponsePassThrough>
      >
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Case_WithOutput_WithResponseWrapper = Grok.Assert<Value, Promise<TestResponse<any>>>;
    type Case_WithOutput_WithResponseData = Grok.Assert<Value, Promise<TestResponse<TestResponseOutbound>>>;
  }

  /**
   * @internal {@link HandlerMiddlewareFunctionOutputFromDefinition}
   */
  export namespace Test_HandlerMiddlewareFunctionOutputFromDefinition_WithoutResponse {
    type Value = HandlerMiddlewareFunctionOutputFromDefinition<HandlerMiddlewareDefinitionBase>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Case_WithOutput_IsPromise = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Value,
          Promise<any> // eslint-disable-line @typescript-eslint/no-explicit-any
        >
      >
    );

    type Case_WithOutput_IsOnlyPassThrough = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Value,
          Promise<HandlerMiddlewareResponsePassThrough>
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerMiddlewareClassImplementation}
 */
export namespace Test_HandlerMiddlewareClassImplementation {
  type Value = HandlerMiddlewareClassImplementation<TestDefinition>;

  type Case_IsFunction = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExtending<
        Value['invoke'],
        Grok.Constraint.FunctionLike
      >
    >
  );

  type Case_IsFunction_WithInput = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        Parameters<Value['invoke']>,
        [HandlerMiddlewareFunctionInputFromDefinition<TestDefinition>]
      >
    >
  );

  type Case_IsFunction_WithOutput = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        ReturnType<Value['invoke']>,
        HandlerMiddlewareFunctionOutputFromDefinition<TestDefinition>
      >
    >
  );
}
