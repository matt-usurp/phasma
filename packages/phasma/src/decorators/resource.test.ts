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
    const decorator = createResourceDecorator('example-resource-definition');

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
        configs: [],
      },
    ]);
  });

  it('with class, multiple resource definitions, return all resource definitions', (): void => {
    const decorator = createResourceDecorator('another-resource-definition');

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
        configs: [],
      },
      {
        type: 'another-resource-definition',
        id: 'bar-id',
        configs: [],
      },
    ]);
  });
});
