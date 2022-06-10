import type { Grok } from '@matt-usurp/grok';
import { NeverReachAssertionError } from '@matt-usurp/grok/core/assert-never';
import type { HandlerFunctionParametersPayload } from '@phasma/handler/src/component/handler';
import { create, nothing } from '@phasma/handler/src/response';
import * as AwsLambda from 'aws-lambda';
import type { LambdaHandlerContextBase } from '../component/context';
import type { LambdaHandlerProviderFromEventSourceIdentifier } from '../component/provider';
import { result } from '../response';
import { entrypoint, factory } from './provider';

type TestContext = (
/* eslint-disable @typescript-eslint/indent */
  HandlerFunctionParametersPayload<
    LambdaHandlerProviderFromEventSourceIdentifier<'cloudwatch:log'>,
    LambdaHandlerContextBase
  >
/* eslint-enable @typescript-eslint/indent */
);

const context: AwsLambda.Context = {
  awsRequestId: 'test-request-id',
  invokedFunctionArn: 'aws:arn:fn:something',
  functionName: 'test-function-name',
  functionVersion: 'test-function-verison',
  memoryLimitInMB: '400',
  getRemainingTimeInMillis: () => 3002,
} as AwsLambda.Context;

describe('entrypoint()', (): void => {
  it('with handler, creates entrypoint, executes as expected, returns nothing', async (): Promise<void> => {
    const handler = vi.fn();
    const wrapper = entrypoint(Promise.resolve(handler));

    expect(handler).toBeCalledTimes(0);

    handler.mockImplementationOnce((input: HandlerFunctionParametersPayload<Grok.Constraint.Anything, LambdaHandlerContextBase>) => {
      expect(input.provider.id).toStrictEqual('provider:aws');
      expect(input.context.function.arn).toStrictEqual('aws:arn:fn:something');
      expect(input.context.function.ttl()).toStrictEqual(3002);

      return nothing();
    });

    const response = await wrapper({
      awslogs: {
        data: 'here-log',
      },
    }, context);

    expect(handler).toBeCalledTimes(1);
    expect(handler).toHaveBeenCalledWith<[TestContext]>({
      provider: {
        id: 'provider:aws',

        payload: {
          awslogs: {
            data: 'here-log',
          },
        },
      },

      context: {
        request: {
          id: 'test-request-id',
        },

        function: {
          arn: 'aws:arn:fn:something',
          name: 'test-function-name',
          version: 'test-function-verison',
          memory: 400,
          ttl: expect.any(Function),
        },
      },
    });

    expect(response).toStrictEqual(undefined);
  });

  it('with handler, creates entrypoint, executes as expected, returns result', async (): Promise<void> => {
    const handler = vi.fn();
    const wrapper = entrypoint(Promise.resolve(handler));

    expect(handler).toBeCalledTimes(0);

    handler.mockImplementationOnce((input: HandlerFunctionParametersPayload<Grok.Constraint.Anything, LambdaHandlerContextBase>) => {
      expect(input.provider.id).toStrictEqual('provider:aws');
      expect(input.context.function.arn).toStrictEqual('aws:arn:fn:something');
      expect(input.context.function.ttl()).toStrictEqual(3002);

      return result({
        foobar: false,
      });
    });

    const response = await wrapper({
      awslogs: {
        data: 'here-log',
      },
    }, context);

    expect(handler).toBeCalledTimes(1);
    expect(handler).toHaveBeenCalledWith<[TestContext]>({
      provider: {
        id: 'provider:aws',

        payload: {
          awslogs: {
            data: 'here-log',
          },
        },
      },

      context: {
        request: {
          id: 'test-request-id',
        },

        function: {
          arn: 'aws:arn:fn:something',
          name: 'test-function-name',
          version: 'test-function-verison',
          memory: 400,
          ttl: expect.any(Function),
        },
      },
    });

    expect(response).toStrictEqual({
      foobar: false,
    });
  });

  it('with handler, creates entrypoint, executes as expected, returns unexpected result, throws never', async (): Promise<void> => {
    const handler = vi.fn();
    const wrapper = entrypoint(Promise.resolve(handler));

    expect(handler).toBeCalledTimes(0);

    handler.mockImplementationOnce((input: HandlerFunctionParametersPayload<Grok.Constraint.Anything, LambdaHandlerContextBase>) => {
      expect(input.provider.id).toStrictEqual('provider:aws');
      expect(input.context.function.arn).toStrictEqual('aws:arn:fn:something');
      expect(input.context.function.ttl()).toStrictEqual(3002);

      return create('response:unknown', {
        unknown: true,
      });
    });

    try {
      await wrapper({
        awslogs: {
          data: 'here-log',
        },
      }, context);
    } catch (caught: unknown) {
      expect(caught).toBeInstanceOf(NeverReachAssertionError);

      return;
    }

    expect(false);
  });
});

describe('factory()', (): void => {
  it('with handler, providing builder composition, creates entrypoint, executes as expected', async (): Promise<void> => {
    const handler = vi.fn();
    const wrapper = factory<'cloudwatch:log'>(async () => handler);

    expect(handler).toBeCalledTimes(0);

    handler.mockImplementationOnce((input: HandlerFunctionParametersPayload<Grok.Constraint.Anything, LambdaHandlerContextBase>) => {
      expect(input.provider.id).toStrictEqual('provider:aws');
      expect(input.context.function.arn).toStrictEqual('aws:arn:fn:something');
      expect(input.context.function.ttl()).toStrictEqual(3002);

      return nothing();
    });

    const response = await wrapper({
      awslogs: {
        data: 'here-log',
      },
    }, context);

    expect(handler).toBeCalledTimes(1);
    expect(handler).toHaveBeenCalledWith<[TestContext]>({
      provider: {
        id: 'provider:aws',

        payload: {
          awslogs: {
            data: 'here-log',
          },
        },
      },

      context: {
        request: {
          id: 'test-request-id',
        },

        function: {
          arn: 'aws:arn:fn:something',
          name: 'test-function-name',
          version: 'test-function-verison',
          memory: 400,
          ttl: expect.any(Function),
        },
      },
    });

    expect(response).toStrictEqual(undefined);
  });

  it('with handler, providing build compisition, composition invoked instantly, only once', async (): Promise<void> => {
    const instrument = vi.fn();

    const wrapper = factory<'cloudwatch:log'>(async (application) => {
      instrument();

      return application.handle({
        handle: async () => nothing(),
      });
    });

    expect(instrument).toBeCalledTimes(1);

    await wrapper({
      awslogs: {
        data: 'here-log',
      },
    }, context);

    expect(instrument).toBeCalledTimes(1);
  });
});
