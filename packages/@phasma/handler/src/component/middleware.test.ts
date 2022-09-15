import type { Grok } from '@matt-usurp/grok';
import type { Middleware } from '../index';
import type { HandlerMiddlewareClassImplementation, HandlerMiddlewareDefinition, HandlerMiddlewareDefinitionBase, HandlerMiddlewareFunctionInputFromDefinition, HandlerMiddlewareFunctionOutputFromDefinition, HandlerMiddlewareNextFunction } from './middleware';
import type { HandlerMiddlewareContextPassThrough, HandlerMiddlewareResponsePassThrough } from './middleware/inherit';
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
   * {@link HandlerMiddlewareDefinition.Get}
   */
  export namespace Test_HandlerMiddlewareDefinition_Get {
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
}

/**
 * {@link HandlerMiddlewareNextFunction}
 */
export namespace Test_HandlerMiddlewareNextFunction {
  type Value = HandlerMiddlewareNextFunction<TestContextOutbound, TestResponse<TestResponseInbound>>;

  type Case_WithFunction = Grok.Assert.IsTrue<Grok.Value.IsExtending<Value, Grok.Constraint.FunctionLike>>;

  type ValueInput = Parameters<Value>;
  type Case_WithFunctionInput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueInput, [TestContextOutbound]>>;

  type ValueOutput = ReturnType<Value>;
  type Case_WithFunctionOutput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueOutput, Promise<TestResponse<TestResponseInbound>>>>;
}

/**
 * {@link HandlerMiddlewareFunctionInputFromDefinition}
 */
export namespace Test_HandlerMiddlewareFunctionInputFromDefinition {
  /**
   * {@link HandlerMiddlewareFunctionInputFromDefinition}
   */
  export namespace Test_HandlerMiddlewareFunctionInputFromDefinition {
    type Value = HandlerMiddlewareFunctionInputFromDefinition<TestDefinition>;

    type Case_WithProvider = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['provider'], TestProvider>>;
    type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['context'], TestContextInbound & HandlerMiddlewareContextPassThrough>>;
    type Case_WithNextFunction = Grok.Assert.IsTrue<Grok.Value.IsExtending<Value['next'], Grok.Constraint.FunctionLike>>;
  }

  /**
   * {@link HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput}
   */
  export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithHandlerInput {
    /**
     * {@link HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithHandlerInput_WithProviderAndContext {
      type Value = HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput<TestDefinition>;

      type ValueProvider = Value['provider'];
      type Case_WithProvider = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueProvider, TestProvider>>;

      type ValueContext = Value['context'];
      type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueContext, TestContextInbound & HandlerMiddlewareContextPassThrough>>;
    }

    /**
     * {@link HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithHandlerInput_WithoutProvider {
      type Value = HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput<(
      /* eslint-disable @typescript-eslint/indent */
        HandlerMiddlewareDefinition<
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          TestContextInbound,
          TestContextOutbound,
          TestResponse<TestResponseInbound>,
          TestResponse<TestResponseOutbound>
        >
      /* eslint-enable @typescript-eslint/indent */
      )>;

      type ValueProvider = Value['provider'];
      type Case_WithProvider = Grok.Assert.IsNever<ValueProvider>;

      type ValueContext = Value['context'];
      type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueContext, TestContextInbound & HandlerMiddlewareContextPassThrough>>;
    }

    /**
     * {@link HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithHandlerInput_WithoutContext {
      type Value = HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput<(
      /* eslint-disable @typescript-eslint/indent */
        HandlerMiddlewareDefinition<
          TestProvider,
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          TestContextOutbound,
          TestResponse<TestResponseInbound>,
          TestResponse<TestResponseOutbound>
        >
      /* eslint-enable @typescript-eslint/indent */
      )>;

      type ValueProvider = Value['provider'];
      type Case_WithProvider = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueProvider, TestProvider>>;

      type ValueContext = Value['context'];
      type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueContext, HandlerMiddlewareContextPassThrough>>;
    }

    /**
     * {@link HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithHandlerInput_WithoutProviderAndContext {
      type Value = HandlerMiddlewareFunctionInputFromDefinition.WithHandlerInput<(
      /* eslint-disable @typescript-eslint/indent */
        HandlerMiddlewareDefinition<
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          TestContextOutbound,
          TestResponse<TestResponseInbound>,
          TestResponse<TestResponseOutbound>
        >
      /* eslint-enable @typescript-eslint/indent */
      )>;

      type ValueProvider = Value['provider'];
      type Case_WithProvider = Grok.Assert.IsNever<ValueProvider>;

      type ValueContext = Value['context'];
      type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueContext, HandlerMiddlewareContextPassThrough>>;
    }
  }

  /**
   * {@link HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction}
   */
  export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithNextFunction {
    /**
     * {@link HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithNextFunction_WithContextAndResponse {
      type Value = HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction<TestDefinition>;

      type Case_WithFunction = Grok.Assert.IsTrue<Grok.Value.IsExtending<Value['next'], Grok.Constraint.FunctionLike>>;

      type ValueInput = Parameters<Value['next']>;
      type Case_WithFunctionInput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueInput, [TestContextOutbound & HandlerMiddlewareContextPassThrough]>>;

      type ValueOutput = ReturnType<Value['next']>;
      type Case_WithFunctionOutput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueOutput, Promise<TestResponse<TestResponseInbound> | HandlerMiddlewareResponsePassThrough>>>;
    }

    /**
     * {@link HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithNextFunction_WithoutContext {
      type Value = HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction<(
      /* eslint-disable @typescript-eslint/indent */
        HandlerMiddlewareDefinition<
          TestProvider,
          TestContextInbound,
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          TestResponse<TestResponseInbound>,
          TestResponse<TestResponseOutbound>
        >
      /* eslint-enable @typescript-eslint/indent */
      )>;

      type Case_WithFunction = Grok.Assert.IsTrue<Grok.Value.IsExtending<Value['next'], Grok.Constraint.FunctionLike>>;

      type ValueInput = Parameters<Value['next']>;
      type Case_WithFunctionInput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueInput, [HandlerMiddlewareContextPassThrough]>>;

      type ValueOutput = ReturnType<Value['next']>;
      type Case_WithFunctionOutput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueOutput, Promise<TestResponse<TestResponseInbound> | HandlerMiddlewareResponsePassThrough>>>;
    }

    /**
     * {@link HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithNextFunction_WithoutResponse {
      type Value = HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction<(
      /* eslint-disable @typescript-eslint/indent */
        HandlerMiddlewareDefinition<
          TestProvider,
          TestContextInbound,
          TestContextOutbound,
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          TestResponse<TestResponseOutbound>
        >
      /* eslint-enable @typescript-eslint/indent */
      )>;

      type Case_WithFunction = Grok.Assert.IsTrue<Grok.Value.IsExtending<Value['next'], Grok.Constraint.FunctionLike>>;

      type ValueInput = Parameters<Value['next']>;
      type Case_WithFunctionInput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueInput, [TestContextOutbound & HandlerMiddlewareContextPassThrough]>>;

      type ValueOutput = ReturnType<Value['next']>;
      type Case_WithFunctionOutput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueOutput, Promise<HandlerMiddlewareResponsePassThrough>>>;
    }

    /**
     * {@link HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction}
     */
    export namespace Test_HandlerMiddlewareFunctionInputFromDefinition_WithNextFunction_WithoutContextAndResponse {
      type Value = HandlerMiddlewareFunctionInputFromDefinition.WithNextFunction<(
      /* eslint-disable @typescript-eslint/indent */
        HandlerMiddlewareDefinition<
          TestProvider,
          TestContextInbound,
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          TestResponse<TestResponseOutbound>
        >
      /* eslint-enable @typescript-eslint/indent */
      )>;

      type Case_WithFunction = Grok.Assert.IsTrue<Grok.Value.IsExtending<Value['next'], Grok.Constraint.FunctionLike>>;

      type ValueInput = Parameters<Value['next']>;
      type Case_WithFunctionInput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueInput, [HandlerMiddlewareContextPassThrough]>>;

      type ValueOutput = ReturnType<Value['next']>;
      type Case_WithFunctionOutput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueOutput, Promise<HandlerMiddlewareResponsePassThrough>>>;
    }
  }
}

/**
 * {@link HandlerMiddlewareFunctionOutputFromDefinition}
 */
export namespace Test_HandlerMiddlewareFunctionOutputFromDefinition {
  /**
   * {@link HandlerMiddlewareFunctionOutputFromDefinition}
   */
  export namespace Test_HandlerMiddlewareFunctionOutputFromDefinition_WithResponse {
    type Value = HandlerMiddlewareFunctionOutputFromDefinition<TestDefinition>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Case_WithPromise = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, Promise<any>>>;

    type Case_WithPassThrough = Grok.Assert<Value, Promise<HandlerMiddlewareResponsePassThrough>>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Case_WithResponseWrapper = Grok.Assert<Value, Promise<TestResponse<any>>>;
    type Case_WithResponseData = Grok.Assert<Value, Promise<TestResponse<TestResponseOutbound>>>;
  }

  /**
   * {@link HandlerMiddlewareFunctionOutputFromDefinition}
   */
  export namespace Test_HandlerMiddlewareFunctionOutputFromDefinition_WithoutResponse {
    type Value = HandlerMiddlewareFunctionOutputFromDefinition<HandlerMiddlewareDefinitionBase>;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type Case_WithPromise = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, Promise<any>>>;

    type Case_WithOnlyPassThrough = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, Promise<HandlerMiddlewareResponsePassThrough>>>;
  }
}

/**
 * {@link HandlerMiddlewareClassImplementation}
 */
export namespace Test_HandlerMiddlewareClassImplementation {
  type Value = HandlerMiddlewareClassImplementation<TestDefinition>;

  type Case_WithFunction = Grok.Assert.IsTrue<Grok.Value.IsExtending<Value['invoke'], Grok.Constraint.FunctionLike>>;
  type Case_WithFunctionInput = Grok.Assert.IsTrue<Grok.Value.IsExactly<Parameters<Value['invoke']>, [HandlerMiddlewareFunctionInputFromDefinition<TestDefinition>]>>;
  type Case_WithFunctionOutput = Grok.Assert.IsTrue<Grok.Value.IsExactly<ReturnType<Value['invoke']>, HandlerMiddlewareFunctionOutputFromDefinition<TestDefinition>>>;
}
