import { ensure, HttpHeaderMapping } from './header';

describe('ensure()', (): void => {
  it('with undefined, return empty header object', (): void => {
    expect(
      ensure(undefined),
    ).toStrictEqual<HttpHeaderMapping>({});
  });

  it('with null, return empty header object', (): void => {
    expect(
      ensure(null),
    ).toStrictEqual<HttpHeaderMapping>({});
  });

  it('with header object, return same header object', (): void => {
    expect(
      ensure({
        foo: 'bar',
      }),
    ).toStrictEqual<HttpHeaderMapping>({
      foo: 'bar',
    });
  });
});
