import { getMetadataValueForKey, pushMetadataValueForKey } from './metadata';

/* eslint-disable @typescript-eslint/no-extraneous-class */

describe('getMetadataValueForKey()', (): void => {
  it('with target, key not set, return undefined', (): void => {
    class TestClass {}

    expect(
      getMetadataValueForKey(TestClass, 'foobar'),
    ).toStrictEqual<undefined>(undefined);
  });

  it('with target, key found, return value', (): void => {
    @Reflect.metadata('foobar', 'bazjane')
    class TestClass {}

    expect(
      getMetadataValueForKey(TestClass, 'foobar'),
    ).toStrictEqual<string>('bazjane');
  });
});

describe('pushMetadataValueForKey()', (): void => {
  it('with taret, no metadata, creates array', (): void => {
    class TestClass {}

    pushMetadataValueForKey<string>(TestClass, 'example', 'one');
    pushMetadataValueForKey<string>(TestClass, 'example', 'two');
    pushMetadataValueForKey<string>(TestClass, 'example', 'three');

    expect(
      getMetadataValueForKey(TestClass, 'example'),
    ).toStrictEqual<string[]>([
      'three',
      'two',
      'one',
    ]);
  });
});
