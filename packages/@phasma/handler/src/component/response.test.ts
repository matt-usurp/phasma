import type { Grok } from '@matt-usurp/grok';
import type { Response } from '../index';
import type { HandlerResponse, HandlerResponseGetIdentifier, HandlerResponseGetValue, HandlerResponseIdentifier, HandlerResponsePresetNothing, HandlerResponsePresetNothingIdentity } from './response';

it('types', (): void => expect(true).toBeTruthy());

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @internal {@link HandlerResponseIdentifier}
 */
export namespace Test_HandlerResponseIdentifier {
  /**
   * @internal {@link HandlerResponseIdentifier}
   */
  export namespace Test_HandlerResponseIdentifier {
    type Assert_CompatibleWithExpectedIdentifierFormat = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerResponseIdentifier<'example'>,
          'response:example'
        >
      >
    );
  }

  /**
   * @internal {@link Response.Identifier}
   */
  export namespace Test_HandlerResponseIdentifier_UsingAlias {
    type Assert_CompatibleWithExpectedIdentifierFormat = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Response.Identifier<'example'>,
          'response:example'
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerResponse}
 */
export namespace Test_HandlerResponse {
  /**
   * @internal {@link HandlerResponse}
   */
  export namespace Test_HandlerResponse {
    type Assert_CompatibleWithExpectedStructure = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerResponse<
            HandlerResponseIdentifier<'one'>,
            'response:value:one'
          >,
          {
            readonly type: 'response:one';
            readonly value: 'response:value:one';
          }
        >
      >
    );
  }

  /**
   * @internal {@link Response}
   */
  export namespace Test_HandlerResponse_UsingAlias {
    type Assert_CompatibleWithExpectedStructure = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Response<
            Response.Identifier<'one'>,
            'response:value:one'
          >,
          {
            readonly type: 'response:one';
            readonly value: 'response:value:one';
          }
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerResponseGetIdentifier}
 */
export namespace Test_HandlerResponseGetIdentifier {
  /**
   * @internal {@link HandlerResponseGetIdentifier}
   */
  export namespace Test_HandlerResponseGetIdentifier {
    type Assert_WithHandlerResponse_CanGetIdentifier = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerResponseGetIdentifier<
            HandlerResponse<
              HandlerResponseIdentifier<'one'>,
              'response:value:one'
            >
          >,
          'response:one'
        >
      >
    );
  }

  /**
   * @internal {@link Response.Get.Identifier}
   */
  export namespace Test_HandlerResponseGetIdentifier_UsingAlias {
    type Assert_WithHandlerResponse_CanGetIdentifier = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Response.Get.Identifier<
            Response<
              Response.Identifier<'one'>,
              'response:value:one'
            >
          >,
          'response:one'
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerResponseGetValue}
 */
export namespace Test_HandlerResponseGetValue {
  /**
   * @internal {@link HandlerResponseGetValue}
   */
  export namespace Test_HandlerResponseGetValue {
    type Assert_WithHandlerResponse_CanGetValue = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerResponseGetValue<
            HandlerResponse<
              HandlerResponseIdentifier<'one'>,
              'response:value:one'
            >
          >,
          'response:value:one'
        >
      >
    );
  }

  /**
   * @internal {@link Response.Get.Value}
   */
  export namespace Test_HandlerResponseGetValue_UsingAlias {
    type Assert_WithHandlerResponse_CanGetValue = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Response.Get.Value<
            Response<
              Response.Identifier<'one'>,
              'response:value:one'
            >
          >,
          'response:value:one'
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerResponsePresetNothingIdentity}
 */
export namespace Test_HandlerResponsePresetNothingIdentity {
  type Assert_CompatibleWithHandlerResponseIdentifier = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        HandlerResponsePresetNothingIdentity,
        HandlerResponseIdentifier<'nothing'>
      >
    >
  );
}

/**
 * @internal {@link HandlerResponsePresetNothing}
 */
export namespace Test_HandlerResponsePresetNothing {
  type Assert_CompatibleWithHandlerResponse = (
    Grok.Assert.IsTrue<
      Grok.Value.IsExactly<
        HandlerResponsePresetNothing,
        HandlerResponse<
          HandlerResponseIdentifier<'nothing'>,
          undefined
        >
      >
    >
  );
}
