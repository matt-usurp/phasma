import { LambdaFunction as AWSLambdaFunction } from '@cdktf/provider-aws/lib/lambda-function';
import { getMetadataKeys } from './metadata';
import type { ResourceDefinition } from './resource';
import { createResourceDecorator, getResourceDefinitions, KEY_RESOURCE_DEFINITIONS } from './resource';

/* eslint-disable @typescript-eslint/no-extraneous-class */

describe('getResourceDefinitions()', (): void => {
  it('with class, no resource definitions, return empty array', (): void => {
    class TestClass {}

    expect(
      getMetadataKeys(TestClass),
    ).toStrictEqual<string[]>([]);

    expect(
      getResourceDefinitions(TestClass),
    ).toStrictEqual<ResourceDefinition[]>([]);
  });

  it('with class, one resource definition, return single resource definition', (): void => {
    const decorator = createResourceDecorator('example-resource-definition', AWSLambdaFunction);

    @decorator('test-id')
    class TestClass {}

    expect(
      getMetadataKeys(TestClass),
    ).toStrictEqual<string[]>([
      KEY_RESOURCE_DEFINITIONS,
    ]);

    expect(
      getResourceDefinitions(TestClass),
    ).toStrictEqual<ResourceDefinition[]>([
      {
        type: 'example-resource-definition',
        id: 'test-id',
        construct: AWSLambdaFunction,
        configs: [],
      },
    ]);
  });

  it('with class, multiple resource definitions, return all resource definitions', (): void => {
    const decorator = createResourceDecorator('another-resource-definition', AWSLambdaFunction);

    @decorator('foo-id')
    @decorator('bar-id')
    class TestClass {}

    expect(
      getMetadataKeys(TestClass),
    ).toStrictEqual<string[]>([
      KEY_RESOURCE_DEFINITIONS,
    ]);

    expect(
      getResourceDefinitions(TestClass),
    ).toStrictEqual<ResourceDefinition[]>([
      {
        type: 'another-resource-definition',
        id: 'foo-id',
        construct: AWSLambdaFunction,
        configs: [],
      },
      {
        type: 'another-resource-definition',
        id: 'bar-id',
        construct: AWSLambdaFunction,
        configs: [],
      },
    ]);
  });

  it('with class, one resource definition, with configurators, return configurator values', (): void =>  {
    const decorator = createResourceDecorator('example-resource-definition', AWSLambdaFunction);

    @decorator('test-id', [
      () => ({ type: 'some-configurator' }),
    ])
    class TestClass {}


    expect(
      getMetadataKeys(TestClass),
    ).toStrictEqual<string[]>([
      KEY_RESOURCE_DEFINITIONS,
    ]);

    expect(
      getResourceDefinitions(TestClass),
    ).toStrictEqual<ResourceDefinition[]>([
      {
        type: 'example-resource-definition',
        id: 'test-id',
        construct: AWSLambdaFunction,
        configs: [
          {
            type: 'some-configurator',
          },
        ],
      },
    ]);
  });
});
