import type { HttpBodyEncoderResult } from '../body';
import { decode, encode } from './json';

describe('encode()', (): void => {
  it('with empty value, undefined, return empty string', (): void => {
    expect(
      encode(undefined),
    ).toStrictEqual<HttpBodyEncoderResult>({
      mime: 'application/json',
      value: '',
    });
  });

  it('with empty value, null, return empty string', (): void => {
    expect(
      encode(null),
    ).toStrictEqual<HttpBodyEncoderResult>({
      mime: 'application/json',
      value: '',
    });
  });

  it('with empty value, empty string, return empty string', (): void => {
    expect(
      encode(''),
    ).toStrictEqual<HttpBodyEncoderResult>({
      mime: 'application/json',
      value: '',
    });
  });

  it('with value, return value as json encoded string', (): void => {
    expect(
      encode({
        name: 'jane',
      }),
    ).toStrictEqual<HttpBodyEncoderResult>({
      mime: 'application/json',
      value: '{"name":"jane"}',
    });
  });
});

describe('decode()', (): void => {
  it('with string, empty, return undefined', (): void => {
    expect(
      decode(''),
    ).toStrictEqual(undefined);
  });

  it('with string, malformed, return undefined', (): void => {
    expect(
      decode('{;'),
    ).toStrictEqual(undefined);
  });

  it('with string, json, return decoded object', (): void => {
    expect(
      decode('{"name":"foo"}'),
    ).toStrictEqual({
      name: 'foo',
    });
  });
});
