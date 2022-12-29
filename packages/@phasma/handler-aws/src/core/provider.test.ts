import { NeverReachAssertionError } from '@matt-usurp/grok/core/assert-never';
import type { EnvironmentMapping } from '@matt-usurp/grok/system/environment';
import { partial } from '@matt-usurp/grok/testing';
import type { HandlerContextBase } from '@phasma/handler/src/component/context';
import type { HandlerFunctionInput } from '@phasma/handler/src/component/handler';
import { create, nothing } from '@phasma/handler/src/response';
import * as AwsLambda from 'aws-lambda';
import type { LambdaHandlerProvider, LambdaHandlerProviderWithEventFromEventSourceIdentifier } from '../component/provider';
import { result } from '../response';
import { entrypoint, factory } from './provider';

type TestContext = (
/* eslint-disable @typescript-eslint/indent */
  HandlerFunctionInput<
    LambdaHandlerProviderWithEventFromEventSourceIdentifier<'cloudwatch:log'>,
    HandlerContextBase
  >
/* eslint-enable @typescript-eslint/indent */
);

const context = partial<AwsLambda.Context>({
  awsRequestId: 'test:context:id',

  logGroupName: 'test:logging:group:name',
  logStreamName: 'test:logging:stream:name',

  invokedFunctionArn: 'test:function:arn',
  functionName: 'test:function:name',
  functionVersion: 'test:function:version',
  memoryLimitInMB: '400',
  getRemainingTimeInMillis: () => 3002,
});

describe('entrypoint()', (): void => {
  it('with handler, creates entrypoint, executes as expected, returns nothing', async (): Promise<void> => {
    const handler = vi.fn();
    const wrapper = entrypoint(Promise.resolve(handler));

    expect(handler).toBeCalledTimes(0);

    handler.mockImplementationOnce((input: HandlerFunctionInput<LambdaHandlerProvider, HandlerContextBase>) => {
      expect(input.provider.id).toStrictEqual('provider:aws:lambda');
      expect(input.provider.function.arn).toStrictEqual('test:function:arn');
      expect(input.provider.function.ttl()).toStrictEqual(3002);

      return nothing();
    });

    const response = await wrapper({
      awslogs: {
        data: 'test:event:logs:data',
      },
    }, context);

    expect(handler).toBeCalledTimes(1);
    expect(handler).toHaveBeenCalledWith<[TestContext]>({
      provider: {
        id: 'provider:aws:lambda',

        function: {
          arn: 'test:function:arn',
          name: 'test:function:name',
          version: 'test:function:version',
          memory: 400,
          ttl: expect.any(Function),
        },

        logging: {
          group: 'test:logging:group:name',
          stream: 'test:logging:stream:name',
        },

        event: {
          awslogs: {
            data: 'test:event:logs:data',
          },
        },
      },

      context: {
        id: 'test:context:id',
      },
    });

    expect(response).toStrictEqual(undefined);
  });

  it('with handler, creates entrypoint, executes as expected, returns result', async (): Promise<void> => {
    const handler = vi.fn();
    const wrapper = entrypoint(Promise.resolve(handler));

    expect(handler).toBeCalledTimes(0);

    handler.mockImplementationOnce((input: HandlerFunctionInput<LambdaHandlerProvider, HandlerContextBase>) => {
      expect(input.provider.id).toStrictEqual('provider:aws:lambda');
      expect(input.provider.function.arn).toStrictEqual('test:function:arn');
      expect(input.provider.function.ttl()).toStrictEqual(3002);

      return result({
        foobar: false,
      });
    });

    const response = await wrapper({
      awslogs: {
        data: 'test:event:logs:data',
      },
    }, context);

    expect(handler).toBeCalledTimes(1);
    expect(handler).toHaveBeenCalledWith<[TestContext]>({
      provider: {
        id: 'provider:aws:lambda',

        function: {
          arn: 'test:function:arn',
          name: 'test:function:name',
          version: 'test:function:version',
          memory: 400,
          ttl: expect.any(Function),
        },

        logging: {
          group: 'test:logging:group:name',
          stream: 'test:logging:stream:name',
        },

        event: {
          awslogs: {
            data: 'test:event:logs:data',
          },
        },
      },

      context: {
        id: 'test:context:id',
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

    handler.mockImplementationOnce((input: HandlerFunctionInput<LambdaHandlerProvider, HandlerContextBase>) => {
      expect(input.provider.id).toStrictEqual('provider:aws:lambda');
      expect(input.provider.function.arn).toStrictEqual('test:function:arn');
      expect(input.provider.function.ttl()).toStrictEqual(3002);

      return create('response:unknown', {
        unknown: true,
      });
    });

    try {
      await wrapper({
        awslogs: {
          data: 'test:event:logs:data',
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

    handler.mockImplementationOnce((input: HandlerFunctionInput<LambdaHandlerProvider, HandlerContextBase>) => {
      expect(input.provider.id).toStrictEqual('provider:aws:lambda');
      expect(input.provider.function.arn).toStrictEqual('test:function:arn');
      expect(input.provider.function.ttl()).toStrictEqual(3002);

      return nothing();
    });

    const response = await wrapper({
      awslogs: {
        data: 'test:event:logs:data',
      },
    }, context);

    expect(handler).toBeCalledTimes(1);
    expect(handler).toHaveBeenCalledWith<[TestContext]>({
      provider: {
        id: 'provider:aws:lambda',

        function: {
          arn: 'test:function:arn',
          name: 'test:function:name',
          version: 'test:function:version',
          memory: 400,
          ttl: expect.any(Function),
        },

        logging: {
          group: 'test:logging:group:name',
          stream: 'test:logging:stream:name',
        },

        event: {
          awslogs: {
            data: 'test:event:logs:data',
          },
        },
      },

      context: {
        id: 'test:context:id',
      },
    });

    expect(response).toStrictEqual(undefined);
  });

  it('with handler, providing built compisition, composition invoked only once', async (): Promise<void> => {
    const instrument = vi.fn();

    const wrapper = factory<'cloudwatch:log'>(async (application) => {
      instrument();

      return application.handle({
        handle: async () => nothing(),
      });
    });

    expect(instrument).toBeCalledTimes(0);

    await wrapper(partial({}), context);

    expect(instrument).toBeCalledTimes(1);

    await wrapper(partial({}), context);
    await wrapper(partial({}), context);
    await wrapper(partial({}), context);

    expect(instrument).toBeCalledTimes(1);
  });

  it('with handler, using default entrypoint method, provides process environment', async (): Promise<void> => {
    const instrument = vi.fn();

    const wrapper = factory<'cloudwatch:log'>(async (application, environment) => {
      instrument(environment);

      return application.handle({
        handle: async () => nothing(),
      });
    });

    expect(instrument).toBeCalledTimes(0);

    await wrapper(partial({}), context);

    expect(instrument).toBeCalledTimes(1);
    expect(instrument).toBeCalledWith<[EnvironmentMapping]>(process.env);
  });

  it('with handler, using custom environment method, provides custom environment', async (): Promise<void> => {
    const instrument = vi.fn();

    const wrapper = factory<'cloudwatch:log'>(async (application, environment) => {
      instrument(environment);

      return application.handle({
        handle: async () => nothing(),
      });
    });

    expect(instrument).toBeCalledTimes(0);

    const handler = wrapper.withEnvironment({
      FOOBAR: 'BAZ',
    });

    await handler(partial({}), context);

    expect(instrument).toBeCalledTimes(1);
    expect(instrument).toBeCalledWith<[EnvironmentMapping]>({
      FOOBAR: 'BAZ',
    });
  });
});
