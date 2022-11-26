import type { HttpBodyEncoderResult } from '../body';
import { decoder, encoder } from './json';

describe('encoder()', (): void => {
  it('with empty value, undefined, return empty string', (): void => {
    expect(
      encoder(undefined),
    ).toStrictEqual<HttpBodyEncoderResult>({
      mime: 'application/json',
      value: '',
    });
  });

  it('with empty value, null, return empty string', (): void => {
    expect(
      encoder(null),
    ).toStrictEqual<HttpBodyEncoderResult>({
      mime: 'application/json',
      value: '',
    });
  });

  it('with empty value, empty string, return empty string', (): void => {
    expect(
      encoder(''),
    ).toStrictEqual<HttpBodyEncoderResult>({
      mime: 'application/json',
      value: '',
    });
  });

  it('with value, return value as json encoded string', (): void => {
    expect(
      encoder({
        name: 'jane',
      }),
    ).toStrictEqual<HttpBodyEncoderResult>({
      mime: 'application/json',
      value: '{"name":"jane"}',
    });
  });
});

describe('decoder()', (): void => {
  it('with string, empty, return undefined', (): void => {
    expect(
      decoder(''),
    ).toStrictEqual(undefined);
  });

  it('with string, malformed, return undefined', (): void => {
    expect(
      decoder('{;'),
    ).toStrictEqual(undefined);
  });

  it('with string, json, return decoded object', (): void => {
    expect(
      decoder('{"name":"foo"}'),
    ).toStrictEqual({
      name: 'foo',
    });
  });
});
