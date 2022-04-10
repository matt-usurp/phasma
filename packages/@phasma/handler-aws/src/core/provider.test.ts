import type { Grok } from '@matt-usurp/grok';
import * as AwsLambda from 'aws-lambda';
import type { HandlerFunctionParametersPayload } from '../../../handler/src/component/handler';
import type { HandlerResponsePresetNothing } from '../../../handler/src/component/response';
import { nothing } from '../../../handler/src/response';
import type { LambdaHandlerContextBase } from '../component/context';
import type { LambdaHandlerProviderFromEventSourceIdentifier } from '../component/provider';
import { entrypoint, factory } from './provider';

type TestContext = (
  HandlerFunctionParametersPayload<
    LambdaHandlerProviderFromEventSourceIdentifier<'cloudwatch:log'>,
    LambdaHandlerContextBase
  >
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
  it('with handler, creates entrypoint, executes as expected', async (): Promise<void> => {
    const handler = jest.fn();
    const wrapper = entrypoint(handler);

    expect(handler).toBeCalledTimes(0);

    handler.mockImplementationOnce((input: HandlerFunctionParametersPayload<Grok.Constraint.Anything, LambdaHandlerContextBase>) => {
      expect(input.provider.id).toStrictEqual('provider:aws');
      expect(input.context.function.arn).toStrictEqual('aws:arn:fn:something');
      expect(input.context.function.ttl()).toStrictEqual(3002);

      return nothing();
    });

    const result = await wrapper({
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

    expect(result).toStrictEqual<HandlerResponsePresetNothing>({
      type: 'response:nothing',
      value: undefined,
    });
  });
});

describe('factory()', (): void => {
  it('with handler, providing builder composition, creates entrypoint, executes as expected', async (): Promise<void> => {
    const handler = jest.fn();
    const wrapper = factory<'cloudwatch:log'>(() => handler);

    expect(handler).toBeCalledTimes(0);

    handler.mockImplementationOnce((input: HandlerFunctionParametersPayload<Grok.Constraint.Anything, LambdaHandlerContextBase>) => {
      expect(input.provider.id).toStrictEqual('provider:aws');
      expect(input.context.function.arn).toStrictEqual('aws:arn:fn:something');
      expect(input.context.function.ttl()).toStrictEqual(3002);

      return nothing();
    });

    const result = await wrapper({
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

    expect(result).toStrictEqual<HandlerResponsePresetNothing>({
      type: 'response:nothing',
      value: undefined,
    });
  });
});
