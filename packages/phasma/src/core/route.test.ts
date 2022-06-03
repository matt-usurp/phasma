import { parse, RoutePart } from './route';

describe('parse()', (): void => {
  it('with empty route, return empty parts', (): void => {
    expect(
      parse(''),
    ).toEqual<RoutePart[]>([]);
  });

  it('with root route, return empty parts', (): void => {
    expect(
      parse('/'),
    ).toEqual<RoutePart[]>([]);
  });

  it('with given route, simple static, return static part', (): void => {
    expect(
      parse('/foo'),
    ).toEqual<RoutePart[]>([
      { type: 'static', value: 'foo' },
    ]);
  });

  it('with given route, multiple static, return static parts', (): void => {
    expect(
      parse('/foo/bar/jane'),
    ).toEqual<RoutePart[]>([
      { type: 'static', value: 'foo' },
      { type: 'static', value: 'bar' },
      { type: 'static', value: 'jane' },
    ]);
  });

  it('with given route, simple parameter, return parameter part', (): void => {
    expect(
      parse('/{foo}'),
    ).toEqual<RoutePart[]>([
      { type: 'parameter', value: 'foo' },
    ]);
  });

  it('with given route, simple parameters, return parameter parts', (): void => {
    expect(
      parse('/{foo}/{bar}'),
    ).toEqual<RoutePart[]>([
      { type: 'parameter', value: 'foo' },
      { type: 'parameter', value: 'bar' },
    ]);
  });

  it('with given route, combination, return route parts', (): void => {
    expect(
      parse('/users/{uid}/sessions/{sid}/expiration'),
    ).toEqual<RoutePart[]>([
      { type: 'static', value: 'users' },
      { type: 'parameter', value: 'uid' },
      { type: 'static', value: 'sessions' },
      { type: 'parameter', value: 'sid' },
      { type: 'static', value: 'expiration' },
    ]);
  });
});
