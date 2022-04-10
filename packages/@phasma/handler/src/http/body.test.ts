import { HttpBodyTransformerResult, json } from './body';

describe('json()', (): void => {
  it('with empty value, undefined, return empty string', (): void => {
    expect(
      json(undefined),
    ).toStrictEqual<HttpBodyTransformerResult>({
      mime: 'application/json',
      value: '',
    });
  });

  it('with empty value, null, return empty string', (): void => {
    expect(
      json(null),
    ).toStrictEqual<HttpBodyTransformerResult>({
      mime: 'application/json',
      value: '',
    });
  });

  it('with empty value, empty string, return empty string', (): void => {
    expect(
      json(''),
    ).toStrictEqual<HttpBodyTransformerResult>({
      mime: 'application/json',
      value: '',
    });
  });

  it('with value, return value as json encoded string', (): void => {
    expect(
      json({
        name: 'jane',
      }),
    ).toStrictEqual<HttpBodyTransformerResult>({
      mime: 'application/json',
      value: '{"name":"jane"}',
    });
  });
});
