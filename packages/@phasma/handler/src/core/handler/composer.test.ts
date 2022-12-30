import type { Grok } from '@matt-usurp/grok';
import type { HandlerContextBase } from '../../component/context';
import type { HandlerClassImplementation, HandlerDefinition, HandlerFunctionInputFromDefinition, HandlerFunctionOutputFromDefinition } from '../../component/handler';
import type { HandlerMiddlewareClassImplementation, HandlerMiddlewareDefinition, HandlerMiddlewareDefinitionUseAnyContextInbound, HandlerMiddlewareDefinitionUseAnyContextOutbound, HandlerMiddlewareDefinitionUseAnyProvider, HandlerMiddlewareDefinitionUseAnyResponseInbound, HandlerMiddlewareDefinitionUseAnyResponseOutbound, HandlerMiddlewareFunctionInputFromDefinition, HandlerMiddlewareFunctionOutputFromDefinition } from '../../component/middleware';
import type { HandlerProvider, HandlerProviderIdentifier } from '../../component/provider';
import type { HandlerResponse, HandlerResponseIdentifier } from '../../component/response';
import type { HandlerComposerWithMiddlware } from './composer';
import { HandlerComposer } from './composer';

type TestProvider = (
  & HandlerProvider<HandlerProviderIdentifier<'test'>>
  & {
    readonly payload: {
      readonly input: unknown;
    };
  }
);

type TestResponse = HandlerResponse<'response:test', {
  state: boolean;
  body: unknown;
}>;

type TestHandlerDefinition = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    TestProvider,
    HandlerContextBase,
    TestResponse
  >
/* eslint-enable @typescript-eslint/indent */
);

const handler = new class Handler implements HandlerClassImplementation<TestHandlerDefinition> {
  public async handle({ provider, context }: HandlerFunctionInputFromDefinition<TestHandlerDefinition>): HandlerFunctionOutputFromDefinition<TestHandlerDefinition> {
    return {
      type: 'response:test',
      value: {
        state: true,
        body: {
          pid: provider.id,
          pin: provider.payload.input,
          ctx: context,
        },
      },
    };
  }
};

describe('HandlerComposer', (): void => {
  it('with handler, returns composition', async (): Promise<void> => {
    const composer = new HandlerComposer<TestProvider, HandlerContextBase, TestResponse>();
    const composition = composer.handle(handler);

    expect(
      await composition({
        provider: {
          id: 'provider:test',
          payload: {
            input: 'provider-input',
          },
        },

        context: {
          id: 'request-id',
        },
      }),
    ).toStrictEqual<TestResponse>({
      type: 'response:test',
      value: {
        state: true,
        body: {
          pid: 'provider:test',
          pin: 'provider-input',
          ctx: {
            id: 'request-id',
          },
        },
      },
    });
  });

  it('with middleware, with handler, returns composition', async (): Promise<void> => {
    type TestMiddleware = (
    /* eslint-disable @typescript-eslint/indent */
      HandlerMiddlewareDefinition<
        HandlerMiddlewareDefinitionUseAnyProvider,
        HandlerContextBase,
        HandlerContextBase & { readonly middleware: unknown },
        HandlerMiddlewareDefinitionUseAnyResponseInbound,
        HandlerMiddlewareDefinitionUseAnyResponseOutbound
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    const middleware = new class Middleware implements HandlerMiddlewareClassImplementation<TestMiddleware> {
      public async invoke({ context, next }: HandlerMiddlewareFunctionInputFromDefinition<TestMiddleware>): HandlerMiddlewareFunctionOutputFromDefinition<TestMiddleware> {
        return next({
          ...context,

          middleware: {
            hello: 'world',
          },
        });
      }
    };

    const composer = new HandlerComposer<TestProvider, HandlerContextBase, TestResponse>();
    const composition = composer
      .use(middleware)
      .handle(handler);

    expect(
      await composition({
        provider: {
          id: 'provider:test',
          payload: {
            input: 'provider-input',
          },
        },

        context: {
          id: 'request-id',
        },
      }),
    ).toStrictEqual<TestResponse>({
      type: 'response:test',
      value: {
        state: true,
        body: {
          pid: 'provider:test',
          pin: 'provider-input',
          ctx: {
            id: 'request-id',

            middleware: {
              hello: 'world',
            },
          },
        },
      },
    });
  });

  it('with middleware, multiple, with handler, middleware are executed in correct order', async (): Promise<void> => {
    type TestMiddleware = (
    /* eslint-disable @typescript-eslint/indent */
      HandlerMiddlewareDefinition<
        HandlerMiddlewareDefinitionUseAnyProvider,
        HandlerContextBase,
        HandlerContextBase & { readonly middleware: unknown },
        HandlerMiddlewareDefinitionUseAnyResponseInbound,
        HandlerMiddlewareDefinitionUseAnyResponseOutbound
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    const middleware = (name: string) => {
      return new class Middleware implements HandlerMiddlewareClassImplementation<TestMiddleware> {
        public async invoke({ context, next }: HandlerMiddlewareFunctionInputFromDefinition<TestMiddleware>): HandlerMiddlewareFunctionOutputFromDefinition<TestMiddleware> {
          return next({
            ...context,

            middleware: {
              name,
              names: [
                ...(context as any).middleware?.names ?? [], // eslint-disable-line @typescript-eslint/no-explicit-any
                name,
              ],
            },
          });
        }
      };
    };

    const composer = new HandlerComposer<TestProvider, HandlerContextBase, TestResponse>();
    const composition = composer
      .use(middleware('first'))
      .use(middleware('second'))
      .use(middleware('third'))
      .handle(handler);

    expect(
      await composition({
        provider: {
          id: 'provider:test',
          payload: {
            input: 'provider-input-again',
          },
        },

        context: {
          id: 'request-id',
        },
      }),
    ).toStrictEqual<TestResponse>({
      type: 'response:test',
      value: {
        state: true,
        body: {
          pid: 'provider:test',
          pin: 'provider-input-again',
          ctx: {
            id: 'request-id',

            middleware: {
              name: 'third',
              names: [
                'first',
                'second',
                'third',
              ],
            },
          },
        },
      },
    });
  });
});

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * {@link HandlerComposerWithMiddlware}
 */
export namespace Test_HandlerComposerWithMiddlware {
  type InferContextFromHandlerComposition<Composition> = (
  /* eslint-disable @typescript-eslint/indent */
    Composition extends (
      HandlerComposer<
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        infer InferValue,
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        any // eslint-disable-line @typescript-eslint/no-explicit-any
      >
    )
      ? InferValue
      : never
  /* eslint-enable @typescript-eslint/indent */
  );

  type InferResponseFromHandlerComposition<Composition> = (
  /* eslint-disable @typescript-eslint/indent */
    Composition extends (
      HandlerComposer<
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        infer InferValue,
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        any // eslint-disable-line @typescript-eslint/no-explicit-any
      >
    )
      ? InferValue
      : never
  /* eslint-enable @typescript-eslint/indent */
  );

  type InferProviderContextFromHandlerComposition<Composition> = (
  /* eslint-disable @typescript-eslint/indent */
    Composition extends (
      HandlerComposer<
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        infer InferValue,
        any // eslint-disable-line @typescript-eslint/no-explicit-any
      >
    )
      ? InferValue
      : never
  /* eslint-enable @typescript-eslint/indent */
  );

  type InferProviderResponseFromHandlerComposition<Composition> = (
  /* eslint-disable @typescript-eslint/indent */
    Composition extends (
      HandlerComposer<
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        any, // eslint-disable-line @typescript-eslint/no-explicit-any
        infer InferValue
      >
    )
      ? InferValue
      : never
  /* eslint-enable @typescript-eslint/indent */
  );

  /**
   * {@link HandlerComposerWithMiddlware}
   */
  export namespace Test_HandlerComposerWithMiddlware_WithResponse_UnionWithCurrentResponse {
    type Provider = HandlerProvider<HandlerProviderIdentifier<'provider'>>;
    type ProviderContext = { ignore: 'provider:context' };
    type ProviderResponse = HandlerResponse<HandlerResponseIdentifier<'provider'>, { ignore: 'provider:response' }>;

    type CurrentContext = { current: 'current:context' };
    type CurrentResponse = HandlerResponse<HandlerResponseIdentifier<'provider'>, { current: 'current:response' }>;

    type MiddlewareContextOutbound = { outbound: 'middleware:context' };
    type MiddlewareResponseInbound = HandlerResponse<HandlerResponseIdentifier<'outbound'>, { outbound: 'middleware:response' }>;

    type MiddlewareDefinition = (
    /* eslint-disable @typescript-eslint/indent */
      HandlerMiddlewareDefinition<
        HandlerMiddlewareDefinitionUseAnyProvider,
        HandlerMiddlewareDefinitionUseAnyContextInbound,
        MiddlewareContextOutbound,
        MiddlewareResponseInbound,
        HandlerMiddlewareDefinitionUseAnyResponseOutbound
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type Value = (
    /* eslint-disable @typescript-eslint/indent */
      HandlerComposerWithMiddlware<
        Provider,
        ProviderContext,
        ProviderResponse,
        CurrentContext,
        CurrentResponse,
        HandlerMiddlewareClassImplementation<MiddlewareDefinition>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type ValueConext = InferContextFromHandlerComposition<Value>;
    type ValueResponse = InferResponseFromHandlerComposition<Value>;

    type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueConext, CurrentContext & MiddlewareContextOutbound>>;
    type Case_WithResponse = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueResponse, CurrentResponse | MiddlewareResponseInbound>>;

    type Case_WithProviderContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<InferProviderContextFromHandlerComposition<Value>, ProviderContext>>;
    type Case_WithProviderResponse = Grok.Assert.IsTrue<Grok.Value.IsExactly<InferProviderResponseFromHandlerComposition<Value>, ProviderResponse>>;
  }

  /**
   * {@link HandlerComposerWithMiddlware}
   */
  export namespace Test_HandlerComposerWithMiddlware_WithInherit_IgnoreMiddleware {
    type Provider = HandlerProvider<HandlerProviderIdentifier<'provider'>>;
    type ProviderContext = { ignore: 'provider:context' };
    type ProviderResponse = HandlerResponse<HandlerResponseIdentifier<'provider'>, { ignore: 'provider:response' }>;

    type CurrentContext = { current: 'current:context' };
    type CurrentResponse = HandlerResponse<HandlerResponseIdentifier<'provider'>, { current: 'current:response' }>;

    type MiddlewareContextOutbound = HandlerMiddlewareDefinitionUseAnyContextOutbound;
    type MiddlewareResponseInbound = HandlerMiddlewareDefinitionUseAnyResponseInbound;

    type MiddlewareDefinition = (
    /* eslint-disable @typescript-eslint/indent */
      HandlerMiddlewareDefinition<
        HandlerMiddlewareDefinitionUseAnyProvider,
        HandlerMiddlewareDefinitionUseAnyContextInbound,
        MiddlewareContextOutbound,
        MiddlewareResponseInbound,
        HandlerMiddlewareDefinitionUseAnyResponseOutbound
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type Value = (
    /* eslint-disable @typescript-eslint/indent */
      HandlerComposerWithMiddlware<
        Provider,
        ProviderContext,
        ProviderResponse,
        CurrentContext,
        CurrentResponse,
        HandlerMiddlewareClassImplementation<MiddlewareDefinition>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type ValueConext = InferContextFromHandlerComposition<Value>;
    type ValueResponse = InferResponseFromHandlerComposition<Value>;

    type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueConext, CurrentContext>>;
    type Case_WithResponse = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueResponse, CurrentResponse>>;

    type Case_WithProviderContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<InferProviderContextFromHandlerComposition<Value>, ProviderContext>>;
    type Case_WithProviderResponse = Grok.Assert.IsTrue<Grok.Value.IsExactly<InferProviderResponseFromHandlerComposition<Value>, ProviderResponse>>;
  }

  /**
   * {@link HandlerComposerWithMiddlware}
   */
  export namespace Test_HandlerComposerWithMiddlware_WithContext_MergeWithCurrentContext {
    type Provider = HandlerProvider<HandlerProviderIdentifier<'provider'>>;
    type ProviderContext = { ignore: 'provider:context' };
    type ProviderResponse = HandlerResponse<HandlerResponseIdentifier<'provider'>, { ignore: 'provider:response' }>;

    type CurrentContext = { current: 'current:context' };
    type CurrentResponse = HandlerResponse<HandlerResponseIdentifier<'provider'>, { current: 'current:response' }>;

    type MiddlewareContextOutbound = { outbound: 'middleware:context' };
    type MiddlewareResponseInbound = HandlerMiddlewareDefinitionUseAnyResponseInbound;

    type MiddlewareDefinition = (
    /* eslint-disable @typescript-eslint/indent */
      HandlerMiddlewareDefinition<
        HandlerMiddlewareDefinitionUseAnyProvider,
        HandlerMiddlewareDefinitionUseAnyContextInbound,
        MiddlewareContextOutbound,
        MiddlewareResponseInbound,
        HandlerMiddlewareDefinitionUseAnyResponseOutbound
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type Value = (
    /* eslint-disable @typescript-eslint/indent */
      HandlerComposerWithMiddlware<
        Provider,
        ProviderContext,
        ProviderResponse,
        CurrentContext,
        CurrentResponse,
        HandlerMiddlewareClassImplementation<MiddlewareDefinition>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type ValueConext = InferContextFromHandlerComposition<Value>;
    type ValueResponse = InferResponseFromHandlerComposition<Value>;

    type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueConext, CurrentContext & MiddlewareContextOutbound>>;
    type Case_WithResponse = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueResponse, CurrentResponse>>;

    type Case_WithProviderContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<InferProviderContextFromHandlerComposition<Value>, ProviderContext>>;
    type Case_WithProviderResponse = Grok.Assert.IsTrue<Grok.Value.IsExactly<InferProviderResponseFromHandlerComposition<Value>, ProviderResponse>>;
  }

  /**
   * {@link HandlerComposerWithMiddlware}
   */
  export namespace Test_HandlerComposerWithMiddlware_WithResponse_UnionWithCurrentResponse {
    type Provider = HandlerProvider<HandlerProviderIdentifier<'provider'>>;
    type ProviderContext = { ignore: 'provider:context' };
    type ProviderResponse = HandlerResponse<HandlerResponseIdentifier<'provider'>, { ignore: 'provider:response' }>;

    type CurrentContext = { current: 'current:context' };
    type CurrentResponse = HandlerResponse<HandlerResponseIdentifier<'provider'>, { current: 'current:response' }>;

    type MiddlewareContextOutbound = HandlerMiddlewareDefinitionUseAnyContextOutbound;
    type MiddlewareResponseInbound = HandlerResponse<HandlerResponseIdentifier<'outbound'>, { outbound: 'middleware:response' }>;

    type MiddlewareDefinition = (
    /* eslint-disable @typescript-eslint/indent */
      HandlerMiddlewareDefinition<
        HandlerMiddlewareDefinitionUseAnyProvider,
        HandlerMiddlewareDefinitionUseAnyContextInbound,
        MiddlewareContextOutbound,
        MiddlewareResponseInbound,
        HandlerMiddlewareDefinitionUseAnyResponseOutbound
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type Value = (
    /* eslint-disable @typescript-eslint/indent */
      HandlerComposerWithMiddlware<
        Provider,
        ProviderContext,
        ProviderResponse,
        CurrentContext,
        CurrentResponse,
        HandlerMiddlewareClassImplementation<MiddlewareDefinition>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    type ValueConext = InferContextFromHandlerComposition<Value>;
    type ValueResponse = InferResponseFromHandlerComposition<Value>;

    type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueConext, CurrentContext>>;
    type Case_WithResponse = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueResponse, CurrentResponse | MiddlewareResponseInbound>>;

    type Case_WithProviderContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<InferProviderContextFromHandlerComposition<Value>, ProviderContext>>;
    type Case_WithProviderResponse = Grok.Assert.IsTrue<Grok.Value.IsExactly<InferProviderResponseFromHandlerComposition<Value>, ProviderResponse>>;
  }

  /**
   * {@link HandlerComposerWithMiddlware.ResolveContext}
   */
  export namespace Test_HandlerComposerWithMiddlware_ResolveContext {
    /**
     * {@link HandlerComposerWithMiddlware.ResolveContext}
     */
    export namespace Test_HandlerComposerWithMiddlware_ResolveContext_WithValue {
      type CurrentContext = { current: 'current:context' };
      type NewContext = { new: 'new:context' };

      type Value = HandlerComposerWithMiddlware.ResolveContext<CurrentContext, NewContext>;

      type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, CurrentContext & NewContext>>;
    }

    /**
     * {@link HandlerComposerWithMiddlware.ResolveContext}
     */
    export namespace Test_HandlerComposerWithMiddlware_ResolveContext_WithAny {
      type CurrentContext = { current: 'current:context' };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type Value = HandlerComposerWithMiddlware.ResolveContext<CurrentContext, any>;

      type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, CurrentContext>>;
    }

    /**
     * {@link HandlerComposerWithMiddlware.ResolveContext}
     */
    export namespace Test_HandlerComposerWithMiddlware_ResolveContext_WithInherit {
      type CurrentContext = { current: 'current:context' };

      type Value = HandlerComposerWithMiddlware.ResolveContext<CurrentContext, HandlerMiddlewareDefinitionUseAnyContextOutbound>;

      type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, CurrentContext>>;
    }
  }

  /**
   * {@link HandlerComposerWithMiddlware.ResolveResponse}
   */
  export namespace Test_HandlerComposerWithMiddlware_ResolveResponse {
    /**
     * {@link HandlerComposerWithMiddlware.ResolveResponse}
     */
    export namespace Test_HandlerComposerWithMiddlware_ResolveResponse_WithValue {
      type CurrentResponse = HandlerResponse<HandlerResponseIdentifier<'current'>, { current: 'current:context' }>;
      type NewResponse = HandlerResponse<HandlerResponseIdentifier<'new'>, { new: 'new:context' }>;

      type Value = HandlerComposerWithMiddlware.ResolveResponse<CurrentResponse, NewResponse>;

      type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, CurrentResponse | NewResponse>>;
    }

    /**
     * {@link HandlerComposerWithMiddlware.ResolveResponse}
     */
    export namespace Test_HandlerComposerWithMiddlware_ResolveResponse_WithAny {
      type CurrentResponse = HandlerResponse<HandlerResponseIdentifier<'current'>, { current: 'current:context' }>;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type Value = HandlerComposerWithMiddlware.ResolveResponse<CurrentResponse, any>;

      type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, CurrentResponse>>;
    }

    /**
     * {@link HandlerComposerWithMiddlware.ResolveResponse}
     */
    export namespace Test_HandlerComposerWithMiddlware_ResolveResponse_WithInherit {
      type CurrentResponse = HandlerResponse<HandlerResponseIdentifier<'current'>, { current: 'current:context' }>;

      type Value = HandlerComposerWithMiddlware.ResolveResponse<CurrentResponse, HandlerMiddlewareDefinitionUseAnyResponseInbound>;

      type Case_WithContext = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, CurrentResponse>>;
    }
  }
}
