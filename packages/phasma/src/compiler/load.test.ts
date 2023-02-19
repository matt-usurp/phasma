import type { DefinedStack } from '.';
import { LambdaFunction } from '../decorators/aws/lambda';
import type { ResourceDefinition } from '../decorators/resource';
import { load } from './load';

describe('load()', (): void => {
  it('with a single target, with a single resource defined, loads the metadata into a stack', (): void => {
    @LambdaFunction('some-function-id')
    class TestClass {}

    const stack = load([TestClass]);

    const targetId = 'TestClass';
    const expectedResource: ResourceDefinition = {
      id: 'some-function-id',
      type: 'lambda-function',
      configs: [],
    };

    expect(stack).toStrictEqual<DefinedStack>({
      resources: [
        expectedResource,
      ],
      resourcesById: {
        'some-function-id': expectedResource,
      },
      resourcesByTargetId: {
        [targetId]: [expectedResource],
      },
      targetsById: {
        [targetId]: TestClass,
      },
    });
  });

  it('with multiple targets, with invididual resource defined, loads the metadata into a stack', (): void => {
    @LambdaFunction('some-function-id')
    class TestFooClass {}

    @LambdaFunction('another-function-id')
    class TestBarClass {}

    const stack = load([TestFooClass, TestBarClass]);

    const fooTargetId = 'TestFooClass';
    const barTargetId = 'TestBarClass';
    const expectedFooResource: ResourceDefinition = {
      id: 'some-function-id',
      type: 'lambda-function',
      configs: [],
    };

    const expectedBarResource: ResourceDefinition = {
      id: 'another-function-id',
      type: 'lambda-function',
      configs: [],
    };

    expect(stack).toStrictEqual<DefinedStack>({
      resources: [
        expectedFooResource,
        expectedBarResource,
      ],
      resourcesById: {
        'some-function-id': expectedFooResource,
        'another-function-id': expectedBarResource,
      },
      resourcesByTargetId: {
        [fooTargetId]: [expectedFooResource],
        [barTargetId]: [expectedBarResource],
      },
      targetsById: {
        [fooTargetId]: TestFooClass,
        [barTargetId]: TestBarClass,
      },
    });
  });

  it('with a single target, with multiple resources defined, loads the metadata into a stack', (): void => {
    @LambdaFunction('some-function-id')
    @LambdaFunction('another-function-id')
    class TestClass {}

    const stack = load([TestClass]);

    const targetId = 'TestClass';
    const expectedFirstResource: ResourceDefinition = {
      id: 'some-function-id',
      type: 'lambda-function',
      configs: [],
    };
    const expectedSecondResource: ResourceDefinition = {
      id: 'another-function-id',
      type: 'lambda-function',
      configs: [],
    };

    expect(stack).toStrictEqual<DefinedStack>({
      resources: [
        expectedFirstResource,
        expectedSecondResource,
      ],
      resourcesById: {
        'some-function-id': expectedFirstResource,
        'another-function-id': expectedSecondResource,
      },
      resourcesByTargetId: {
        [targetId]: [expectedFirstResource, expectedSecondResource],
      },
      targetsById: {
        [targetId]: TestClass,
      },
    });

  });
});
