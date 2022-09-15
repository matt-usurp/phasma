import type { HandlerContextBase } from '../../component/context';
import type { HandlerClassImplementation, HandlerDefinition, HandlerFunctionInputFromDefinition, HandlerFunctionOutputFromDefinition } from '../../component/handler';
import type { HandlerMiddlewareClassImplementation, HandlerMiddlewareDefinition, HandlerMiddlewareFunctionInputFromDefinition, HandlerMiddlewareFunctionOutputFromDefinition } from '../../component/middleware';
import type { HandlerProviderWithPayload } from '../../component/provider';
import type { HandlerResponse } from '../../component/response';
import { HandlerComposer } from './composer';

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

  it('with middleware, with handler, returns composition', async (): Promise<void> => {
    type TestMiddleware = (
    /* eslint-disable @typescript-eslint/indent */
      HandlerMiddlewareDefinition<
        HandlerMiddlewareDefinition.Inherit.Provider,
        HandlerContextBase,
        HandlerContextBase & { readonly middleware: unknown },
        HandlerMiddlewareDefinition.Inherit.ResponseInbound,
        HandlerMiddlewareDefinition.Inherit.ResponseOutbound
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
        HandlerMiddlewareDefinition.Inherit.Provider,
        HandlerContextBase,
        HandlerContextBase & { readonly middleware: unknown },
        HandlerMiddlewareDefinition.Inherit.ResponseInbound,
        HandlerMiddlewareDefinition.Inherit.ResponseOutbound
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