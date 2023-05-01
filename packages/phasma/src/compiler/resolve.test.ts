/* eslint-disable @typescript-eslint/no-extraneous-class */
import { LambdaFunction as AWSLambdaFunction } from '@cdktf/provider-aws/lib/lambda-function';
import type { DefinedStack } from '.';
import type { ResourceDefinition } from '../decorators/resource';
import { resolve } from './resolve';

describe('resolve()', (): void => {
  it('with a stack, with a reference, resolves the reference to a target', (): void => {
    class TestFunction {}
    class TestQueue {}

    const functionResource: ResourceDefinition = {
      type: 'lambda-function',
      id: 'some-lambda-function',
      construct: AWSLambdaFunction,
      configs: [
        {
          type: 'stack-reference',
          id: TestQueue.name,
        },
      ],
    };

    const queueResource: ResourceDefinition = {
      type: 'sqs-queue',
      id: 'some-queue',
      construct: AWSLambdaFunction,
      configs: [],
    };

    const mockStack: DefinedStack = {
      resources: [
        functionResource,
        queueResource,
      ],
      resourcesById: {
        'some-lambda-function': functionResource,
        'some-queue': queueResource,
      },
      resourcesByTargetId: {
        [TestQueue.name]: [queueResource],
        [TestFunction.name]: [functionResource],
      },
      targetsById: {
        [TestQueue.name]: TestQueue,
        [TestFunction.name]: TestFunction,
      },
    };

    const result = resolve(mockStack);

    expect(result.resourcesById['some-lambda-function'].configs).toStrictEqual([
      {
        type: 'stack-reference',
        id: TestQueue.name,
        target: [queueResource],
      },
    ]);
  });
});
