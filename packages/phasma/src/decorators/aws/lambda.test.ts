import { LambdaFunction as AWSLambdaFunction } from '@cdktf/provider-aws/lib/lambda-function';
import type { ResourceDefinition } from '../resource';
import { getResourceDefinitions } from '../resource';
import { KEY_RESOURCE_LAMBDA_FUNCTION, KEY_RESOURCE_LAMBDA_FUNCTION_MEMORY, LambdaFunction, LambdaFunctionMemory } from './lambda';

/* eslint-disable @typescript-eslint/no-extraneous-class */

describe('LambdaFunction', (): void => {
  it('with decorator, only identity, create resource definition', (): void => {
    @LambdaFunction('test-function-id')
    class TestClass {}

    expect(
      getResourceDefinitions(TestClass),
    ).toStrictEqual<ResourceDefinition[]>([
      {
        type: KEY_RESOURCE_LAMBDA_FUNCTION,
        id: 'test-function-id',
        construct: AWSLambdaFunction,
        configs: [],
      },
    ]);
  });

  it('with decorator, with memory, create resource definition', (): void => {
    @LambdaFunction('test-function-id', [
      LambdaFunctionMemory(512),
    ])
    class TestClass {}

    expect(
      getResourceDefinitions(TestClass),
    ).toStrictEqual<ResourceDefinition[]>([
      {
        type: KEY_RESOURCE_LAMBDA_FUNCTION,
        id: 'test-function-id',
        construct: AWSLambdaFunction,
        configs: [
          {
            type: KEY_RESOURCE_LAMBDA_FUNCTION_MEMORY,
            memory: 512,
          },
        ],
      },
    ]);
  });
});
