import { ensure, HttpResponseHeaderMapping } from './header';

describe('ensure()', (): void => {
  it('with undefined, return empty header object', (): void => {
    expect(
      ensure(undefined),
    ).toStrictEqual<HttpResponseHeaderMapping>({});
  });

  it('with null, return empty header object', (): void => {
    expect(
      ensure(null),
    ).toStrictEqual<HttpResponseHeaderMapping>({});
  });

  it('with header object, return same header object', (): void => {
    expect(
      ensure({
        foo: 'bar',
      }),
    ).toStrictEqual<HttpResponseHeaderMapping>({
      foo: 'bar',
    });
  });
});
