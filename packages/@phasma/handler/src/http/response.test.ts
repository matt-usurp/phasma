import type { Grok } from '@matt-usurp/grok';
import type { HttpHeaderMapping } from './header';
import { http, HttpFactoryPartialTransport, HttpResponse, HttpResponseTransport, HttpResponseTransportKind } from './response';

type TestOkayResponse = HttpResponseTransport<200, {
  name: string;
  age: number;
}>;

type TestBodylessResponse = HttpResponseTransport<201, undefined>;

describe('http()', (): void => {
  it('with given transport, creates http response', (): void => {
    expect(
      http<TestOkayResponse>({
        status: 200,

        body: {
          name: 'fanta',
          age: 30,
        },
      }),
    ).toStrictEqual<HttpResponse<HttpResponseTransportKind>>({
      type: 'response:http',

      value: {
        status: 200,
        headers: undefined,
        body: {
          name: 'fanta',
          age: 30,
        },
      },
    });
  });

  it('with given transport, undefined body, creates http response', (): void => {
    expect(
      http<TestBodylessResponse>({
        status: 201,
        body: undefined,
      }),
    ).toStrictEqual<HttpResponse<TestBodylessResponse>>({
      type: 'response:http',
      value: {
        status: 201,
        headers: undefined,
        body: undefined,
      },
    });
  });
});

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */

type TestHttpHeaderMapping = {
  readonly 'header:key:a': 'header:value:a';
  readonly 'header:key:b': 'header:value:b';
};

/**
 * @internal {@link HttpFactoryPartialTransport}
 */
export namespace Test_HttpFactoryPartialTransport {
  /**
   * @internal {@link HttpFactoryPartialTransport}
   */
  export namespace Test_HttpFactoryPartialTransport_DefaultState {
    export type Value = (
      HttpFactoryPartialTransport<
        HttpResponseTransport<200>
      >
    );

    export type Case_WithStatusCode = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['status'], 200>>;
    export type Case_WithStatusCodeOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'status'>>;

    export type Case_WithBody = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['body'], undefined>>;
    export type Case_WithBodyOptional = Grok.Assert.IsTrue<Grok.Record.IsKeyOptional<Value, 'body'>>;

    export type Case_WithHeaders = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['headers'], HttpHeaderMapping | undefined>>;
    export type Case_WithHeadersOptional = Grok.Assert.IsTrue<Grok.Record.IsKeyOptional<Value, 'headers'>>;

    const implementation: Value = {
      status: 200,
    };
  }

  /**
   * @internal {@link HttpFactoryPartialTransport}
   */
  export namespace Test_HttpFactoryPartialTransport_WithHeaders_SetUndefined {
    export type Value = (
      HttpFactoryPartialTransport<
        HttpResponseTransport<
          202,
          'test:body',
          undefined
        >
      >
    );

    export type Case_WithStatusCode = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['status'], 202>>;
    export type Case_WithStatusCodeOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'status'>>;

    export type Case_WithBody = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['body'], 'test:body'>>;
    export type Case_WithBodyOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'body'>>;

    export type Case_WithHeaders = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['headers'], undefined>>;
    export type Case_WithHeadersOptional = Grok.Assert.IsTrue<Grok.Record.IsKeyOptional<Value, 'headers'>>;

    const implementation: Value = {
      status: 202,
      body: 'test:body',
    };
  }

  /**
   * @internal {@link HttpFactoryPartialTransport}
   */
  export namespace Test_HttpFactoryPartialTransport_WithBody_SetUndefined {
    export type Value = (
      HttpFactoryPartialTransport<
        HttpResponseTransport<
          202,
          undefined,
          TestHttpHeaderMapping
        >
      >
    );

    export type Case_WithStatusCode = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['status'], 202>>;
    export type Case_WithStatusCodeOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'status'>>;

    export type Case_WithBody = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['body'], undefined>>;
    export type Case_WithBodyOptional = Grok.Assert.IsTrue<Grok.Record.IsKeyOptional<Value, 'body'>>;

    export type Case_WithHeaders = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['headers'], TestHttpHeaderMapping>>;
    export type Case_WithHeadersOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'headers'>>;

    const implementation: Value = {
      status: 202,

      headers: {
        'header:key:a': 'header:value:a',
        'header:key:b': 'header:value:b',
      },
    };
  }

  /**
   * @internal {@link HttpFactoryPartialTransport}
   */
  export namespace Test_HttpFactoryPartialTransport_WithBodyAndHeaders_SetUndefined {
    export type Value = (
      HttpFactoryPartialTransport<
        HttpResponseTransport<
          202,
          undefined,
          undefined
        >
      >
    );

    export type Case_WithStatusCode = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['status'], 202>>;
    export type Case_WithStatusCodeOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'status'>>;

    export type Case_WithBody = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['body'], undefined>>;
    export type Case_WithBodyOptional = Grok.Assert.IsTrue<Grok.Record.IsKeyOptional<Value, 'body'>>;

    export type Case_WithHeaders = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['headers'], undefined>>;
    export type Case_WithHeadersOptional = Grok.Assert.IsTrue<Grok.Record.IsKeyOptional<Value, 'headers'>>;

    const implementation: Value = {
      status: 202,
    };
  }

  /**
   * @internal {@link HttpFactoryPartialTransport}
   */
  export namespace Test_HttpFactoryPartialTransport_WithAllValuesDefined {
    export type Value = (
      HttpFactoryPartialTransport<
        HttpResponseTransport<
          202,
          'test:body',
          TestHttpHeaderMapping
        >
      >
    );

    export type Case_WithStatusCode = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['status'], 202>>;
    export type Case_WithStatusCodeOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'status'>>;

    export type Case_WithBody = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['body'], 'test:body'>>;
    export type Case_WithBodyOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'body'>>;

    export type Case_WithHeaders = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['headers'], TestHttpHeaderMapping>>;
    export type Case_WithHeadersOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'headers'>>;

    const implementation: Value = {
      status: 202,
      body: 'test:body',

      headers: {
        'header:key:a': 'header:value:a',
        'header:key:b': 'header:value:b',
      },
    };
  }

  /**
   * @internal {@link HttpFactoryPartialTransport}
   */
  export namespace Test_HttpFactoryPartialTransport_WithBody_SetAny {
    export type Value = (
      HttpFactoryPartialTransport<
        HttpResponseTransport<
          202,
          any, // eslint-disable-line @typescript-eslint/no-explicit-any
          TestHttpHeaderMapping
        >
      >
    );

    export type Case_WithStatusCode = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['status'], 202>>;
    export type Case_WithStatusCodeOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'status'>>;

    export type Case_WithBody = Grok.Assert.IsTrue<Grok.Value.IsAny<Value['body']>>;
    export type Case_WithBodyOptional = Grok.Assert.IsTrue<Grok.Record.IsKeyOptional<Value, 'body'>>;

    export type Case_WithHeaders = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['headers'], TestHttpHeaderMapping>>;
    export type Case_WithHeadersOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'headers'>>;

    const implementation: Value = {
      status: 202,

      headers: {
        'header:key:a': 'header:value:a',
        'header:key:b': 'header:value:b',
      },
    };
  }

  /**
   * @internal {@link HttpFactoryPartialTransport}
   */
  export namespace Test_HttpFactoryPartialTransport_WithHeaders_SetAny {
    export type Value = (
      HttpFactoryPartialTransport<
        HttpResponseTransport<
          202,
          'test:body',
          any // eslint-disable-line @typescript-eslint/no-explicit-any
        >
      >
    );

    export type Case_WithStatusCode = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['status'], 202>>;
    export type Case_WithStatusCodeOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'status'>>;

    export type Case_WithBody = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value['body'], 'test:body'>>;
    export type Case_WithBodyOptional = Grok.Assert.IsFalse<Grok.Record.IsKeyOptional<Value, 'body'>>;

    export type Case_WithHeaders = Grok.Assert.IsTrue<Grok.Value.IsAny<Value['headers']>>;
    export type Case_WithHeadersOptional = Grok.Assert.IsTrue<Grok.Record.IsKeyOptional<Value, 'headers'>>;

    const implementation: Value = {
      status: 202,
      body: 'test:body',
    };
  }
}
