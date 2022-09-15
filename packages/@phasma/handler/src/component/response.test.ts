import type { Grok } from '@matt-usurp/grok';
import type { HandlerResponse, HandlerResponseIdentifier, HandlerResponsePresetNothing, HandlerResponsePresetNothingIdentity } from './response';

it('ignored, only type tests', (): void => {
  expect(true).toStrictEqual(true);
});

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * {@link HandlerResponseIdentifier}
 */
export namespace Test_HandlerResponseIdentifier {
  type Case_WithOne = Grok.Assert<HandlerResponseIdentifier<'one'>, 'response:one'>;
  type Case_WithTwo = Grok.Assert<HandlerResponseIdentifier<'two'>, 'response:two'>;
  type Case_WithThree = Grok.Assert<HandlerResponseIdentifier<'three'>, 'response:three'>;
}

/**
 * {@link HandlerResponse}
 */
export namespace Test_HandlerResponse {
  type TestResponseOne = HandlerResponse<HandlerResponseIdentifier<'one'>, 'value-one'>;
  type TestResponseTwo = HandlerResponse<HandlerResponseIdentifier<'two'>, 'value-two'>;

  /**
   * {@link HandlerResponse}
   */
  export namespace Test_HandlerResponse {
    type Case_WithStructureOne = Grok.Assert<TestResponseOne, {
      readonly type: 'response:one';
      readonly value: 'value-one';
    }>;

    type Case_WithStructureTwo = Grok.Assert<TestResponseTwo, {
      readonly type: 'response:two';
      readonly value: 'value-two';
    }>;
  }

  /**
   * {@link HandlerResponse.Get}
   */
  export namespace Test_HandlerResponse_Get {
    /**
     * {@link HandlerResponse.Get.Identifier}
     */
    export namespace Test_HandlerResponse_Get_Identifier {
      type Case_WithOne = Grok.Assert<HandlerResponse.Get.Identifier<TestResponseOne>, 'response:one'>;
      type Case_WithTwo = Grok.Assert<HandlerResponse.Get.Identifier<TestResponseTwo>, 'response:two'>;
    }

    /**
     * {@link HandlerResponse.Get.Value}
     */
    export namespace Test_HandlerResponse_Get_Value {
      type Case_WithOne = Grok.Assert<HandlerResponse.Get.Value<TestResponseOne>, 'value-one'>;
      type Case_WithTwo = Grok.Assert<HandlerResponse.Get.Value<TestResponseTwo>, 'value-two'>;
    }
  }
}

/**
 * {@link HandlerResponsePresetNothingIdentity}
 */
export namespace Test_HandlerResponsePresetNothingIdentity {
  type Case_WithIdentifier = Grok.Assert<HandlerResponsePresetNothingIdentity, 'response:nothing'>;
}

/**
 * {@link HandlerResponsePresetNothing}
 */
export namespace Test_HandlerResponsePresetNothing {
  type Case_WithStructure = Grok.Assert<HandlerResponsePresetNothing, {
    readonly type: 'response:nothing';
    readonly value: undefined;
  }>;
}
