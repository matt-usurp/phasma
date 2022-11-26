import { parse, stringify } from './query';

describe('parse()', (): void => {
  it('with malformed string, does not throw error', (): void => {
    expect(
      parse('foo'),
    ).toStrictEqual({
      foo: '',
    });
  });

  it('with single parameter, normalises to object', (): void => {
    expect(
      parse('a=hello'),
    ).toStrictEqual({
      a: 'hello',
    });
  });

  it('with single nested parameter, normalises to object', (): void => {
    expect(
      parse('a[b]=hello'),
    ).toStrictEqual({
      a: {
        b: 'hello',
      },
    });
  });

  it('with single multi-nested parameter, normalises to object', (): void => {
    expect(
      parse('a[b][c][d]=hello'),
    ).toStrictEqual({
      a: {
        b: {
          c: {
            d: 'hello',
          },
        },
      },
    });
  });

  it('with single array parameter, single item, normalises to object', (): void => {
    expect(
      parse('a[]=one'),
    ).toStrictEqual({
      a: [
        'one',
      ],
    });
  });

  it('with single array parameter, multiple items, normalises to object', (): void => {
    expect(
      parse('a[]=one&a[]=two'),
    ).toStrictEqual({
      a: [
        'one',
        'two',
      ],
    });
  });

  it('with mixed parameters, normalises to object', (): void => {
    expect(
      parse('a=one&b[]=two&b[]=three&c[d][e]=four'),
    ).toStrictEqual({
      a: 'one',
      b: [
        'two',
        'three',
      ],
      c: {
        d: {
          e: 'four',
        },
      },
    });
  });

  it('with dot separated keys, normalises to an object', (): void => {
    expect(
      parse('a.b=c'),
    ).toStrictEqual({
      a: {
        b: 'c',
      },
    });
  });

  it('with comma separated values, normalises to an array', (): void => {
    expect(
      parse('a=b,c,d'),
    ).toStrictEqual({
      a: ['b', 'c', 'd'],
    });
  });

  it('with %20 space encoding, normalises %20 to spaces', (): void => {
    expect(
      parse('a=b%20c'),
    ).toStrictEqual({
      a: 'b c',
    });
  });

  it('with RFC1738 space encoding, normalises + to spaces', (): void => {
    expect(
      parse('a=b+c'),
    ).toStrictEqual({
      a: 'b c',
    });
  });

  it('with boolean', (): void => {
    expect(
      parse('a=true'),
    ).toStrictEqual({
      a: 'true',
    });
  });
});

describe('stringify()', (): void => {
  it('with undefined', (): void => {
    expect(
      stringify(undefined),
    ).toStrictEqual('');
  });

  it('with null', (): void => {
    expect(
      stringify(null),
    ).toStrictEqual('');
  });

  it('with object, empty', (): void => {
    expect(
      stringify({}),
    ).toStrictEqual('');
  });

  it('with object, simple strings', (): void => {
    expect(
      stringify({
        a: 'a',
        b: 'b',
      }),
    ).toStrictEqual('a=a&b=b');
  });

  it('with object, simple multi-value', (): void => {
    expect(
      stringify({
        a: 'a',
        b: 2,
        c: false,
      }),
    ).toStrictEqual('a=a&b=2&c=false');
  });

  it('with object, simple array', (): void => {
    expect(
      stringify({
        a: [
          'a',
          'b',
          'c',
        ],
      }),
    ).toStrictEqual('a=a,b,c');
  });
});
