import type { HandlerContextBase } from '../component/context';
import type { HandlerDefinition, HandlerFunctionParameters, HandlerFunctionResponse, HandlerImplementationWithHandleFunction } from '../component/handler';
import type { HandlerMiddlewareDefinition, HandlerMiddlewareFunctionParameters, HandlerMiddlewareFunctionResponse, HandlerMiddlewareImplementationWithInvokeFunction } from '../component/middleware';
import type { HandlerProviderWithPayload } from '../component/provider';
import type { HandlerResponse } from '../component/response';
import { HandlerBuilder } from './builder';

type TestProvider = HandlerProviderWithPayload<'provider:test', {
  input: unknown;
}>;

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

const handler = new class Handler implements HandlerImplementationWithHandleFunction<TestHandlerDefinition> {
  public async handle({ provider, context }: HandlerFunctionParameters<TestHandlerDefinition>): HandlerFunctionResponse<TestHandlerDefinition> {
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

describe('HandlerBuilder', (): void => {
  it('with handler, returns composite', async (): Promise<void> => {
    const builder = new HandlerBuilder<TestProvider, HandlerContextBase, TestResponse>();
    const composite = builder.handle(handler);

    expect(
      await composite({
        provider: {
          id: 'provider:test',
          payload: {
            input: 'provider-input',
          },
        },

        context: {
          request: {
            id: 'request-id',
          },
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
            request: {
              id: 'request-id',
            },
          },
        },
      },
    });
  });

  it('with middleware, with handler, returns composite', async (): Promise<void> => {
    type TestMiddleware = (
    /* eslint-disable @typescript-eslint/indent */
      HandlerMiddlewareDefinition<
        HandlerMiddlewareDefinition.SomeProvider,
        HandlerContextBase,
        HandlerContextBase & { readonly middleware: unknown },
        HandlerMiddlewareDefinition.SomeResponseInbound,
        HandlerMiddlewareDefinition.SomeResponseOutbound
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    const middleware = new class Middleware implements HandlerMiddlewareImplementationWithInvokeFunction<TestMiddleware> {
      public async invoke({ context, next }: HandlerMiddlewareFunctionParameters<TestMiddleware>): HandlerMiddlewareFunctionResponse<TestMiddleware> {
        return next({
          ...context,

          middleware: {
            hello: 'world',
          },
        });
      }
    };

    const builder = new HandlerBuilder<TestProvider, HandlerContextBase, TestResponse>();
    const composite = builder
      .use(middleware)
      .handle(handler);

    expect(
      await composite({
        provider: {
          id: 'provider:test',
          payload: {
            input: 'provider-input',
          },
        },

        context: {
          request: {
            id: 'request-id',
          },
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
            request: {
              id: 'request-id',
            },

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
        HandlerMiddlewareDefinition.SomeProvider,
        HandlerContextBase,
        HandlerContextBase & { readonly middleware: unknown },
        HandlerMiddlewareDefinition.SomeResponseInbound,
        HandlerMiddlewareDefinition.SomeResponseOutbound
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    const middleware = (name: string) => {
      return new class Middleware implements HandlerMiddlewareImplementationWithInvokeFunction<TestMiddleware> {
        public async invoke({ context, next }: HandlerMiddlewareFunctionParameters<TestMiddleware>): HandlerMiddlewareFunctionResponse<TestMiddleware> {
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

    const builder = new HandlerBuilder<TestProvider, HandlerContextBase, TestResponse>();
    const composite = builder
      .use(middleware('first'))
      .use(middleware('second'))
      .use(middleware('third'))
      .handle(handler);

    expect(
      await composite({
        provider: {
          id: 'provider:test',
          payload: {
            input: 'provider-input-again',
          },
        },

        context: {
          request: {
            id: 'request-id',
          },
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
            request: {
              id: 'request-id',
            },

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
