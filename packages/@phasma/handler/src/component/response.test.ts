import type { Grok } from '@matt-usurp/grok';
import type { Response } from '../index';
import type { HandlerResponse, HandlerResponseGetIdentifier, HandlerResponseGetValue, HandlerResponseIdentifier, HandlerResponsePresetNothing, HandlerResponsePresetNothingIdentity } from './response';

it('ignored, only type tests', (): void => {
  expect(true).toStrictEqual(true);
});

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * {@link HandlerResponseIdentifier}
 */
export namespace Test_HandlerResponseIdentifier {
  /**
   * {@link HandlerResponseIdentifier}
   */
  export namespace Test_HandlerResponseIdentifier {
    type Case_WithOne = Grok.Assert<HandlerResponseIdentifier<'one'>, 'response:one'>;
    type Case_WithTwo = Grok.Assert<HandlerResponseIdentifier<'two'>, 'response:two'>;
    type Case_WithThree = Grok.Assert<HandlerResponseIdentifier<'three'>, 'response:three'>;
  }

  /**
   * {@link Response.Identifier}
   */
  export namespace Test_HandlerResponseIdentifier_UsingAlias {
    type Case_WithOne = Grok.Assert<Response.Identifier<'one'>, 'response:one'>;
    type Case_WithTwo = Grok.Assert<Response.Identifier<'two'>, 'response:two'>;
    type Case_WithThree = Grok.Assert<Response.Identifier<'three'>, 'response:three'>;
  }
}

/**
 * {@link HandlerResponse}
 */
export namespace Test_HandlerResponse {
  /**
   * {@link HandlerResponse}
   */
  export namespace Test_HandlerResponse {
    type Case_WithStructureOne = Grok.Assert<HandlerResponse<HandlerResponseIdentifier<'one'>, 'value-one'>, {
      readonly type: 'response:one';
      readonly value: 'value-one';
    }>;

    type Case_WithStructureTwo = Grok.Assert<HandlerResponse<HandlerResponseIdentifier<'two'>, 'value-two'>, {
      readonly type: 'response:two';
      readonly value: 'value-two';
    }>;
  }

  /**
   * {@link Response}
   */
  export namespace Test_HandlerResponse_UsingAlias {
    type Case_WithStructureOne = Grok.Assert<Response<Response.Identifier<'one'>, 'value-one'>, {
      readonly type: 'response:one';
      readonly value: 'value-one';
    }>;

    type Case_WithStructureTwo = Grok.Assert<Response<Response.Identifier<'two'>, 'value-two'>, {
      readonly type: 'response:two';
      readonly value: 'value-two';
    }>;
  }
}

/**
 * {@link HandlerResponseGetIdentifier}
 */
export namespace Test_HandlerResponseGetIdentifier {
  /**
   * {@link HandlerResponseGetIdentifier}
   */
  export namespace Test_HandlerResponseGetIdentifier {
    type Case_WithOne = Grok.Assert<HandlerResponseGetIdentifier<HandlerResponse<HandlerResponseIdentifier<'one'>, 'value-one'>>, 'response:one'>;
    type Case_WithTwo = Grok.Assert<HandlerResponseGetIdentifier<HandlerResponse<HandlerResponseIdentifier<'two'>, 'value-two'>>, 'response:two'>;
  }

  /**
   * {@link Response.Get.Identifier}
   */
  export namespace Test_HandlerResponseGetIdentifier_UsingAlias {
    type Case_WithOne = Grok.Assert<Response.Get.Identifier<HandlerResponse<HandlerResponseIdentifier<'one'>, 'value-one'>>, 'response:one'>;
    type Case_WithTwo = Grok.Assert<Response.Get.Identifier<HandlerResponse<HandlerResponseIdentifier<'two'>, 'value-two'>>, 'response:two'>;
  }
}

/**
 * {@link HandlerResponseGetValue}
 */
export namespace Test_HandlerResponseGetValue {
  /**
   * {@link HandlerResponseGetValue}
   */
  export namespace Test_HandlerResponseGetValue {
    type Case_WithOne = Grok.Assert<HandlerResponseGetValue<HandlerResponse<HandlerResponseIdentifier<'one'>, 'value-one'>>, 'value-one'>;
    type Case_WithTwo = Grok.Assert<HandlerResponseGetValue<HandlerResponse<HandlerResponseIdentifier<'two'>, 'value-two'>>, 'value-two'>;
  }

  /**
   * {@link Response.Get.Value}
   */
  export namespace Test_HandlerResponseGetValue_UsingAlias {
    type Case_WithOne = Grok.Assert<Response.Get.Value<HandlerResponse<HandlerResponseIdentifier<'one'>, 'value-one'>>, 'value-one'>;
    type Case_WithTwo = Grok.Assert<Response.Get.Value<HandlerResponse<HandlerResponseIdentifier<'two'>, 'value-two'>>, 'value-two'>;
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
