import type { HandlerResponse, HandlerResponsePresetNothing } from './component/response';
import { create, nothing, unwrap } from './response';

type TestResponseOne = HandlerResponse<'response:test:one', boolean>;

type TestResponseTwo = HandlerResponse<'response:test:two', TestResponseTwoBody>;
type TestResponseTwoBody = {
  readonly foo: string;
  readonly bar: string;
};

describe('unwrap()', (): void => {
  it('with response one, unwrap, boolean', (): void => {
    expect(
      unwrap<TestResponseOne>({
        type: 'response:test:one',
        value: false,
      }),
    ).toStrictEqual(false);
  });

  it('with response two, unwrap, object', (): void => {
    expect(
      unwrap<TestResponseTwo>({
        type: 'response:test:two',
        value: {
          foo: 'foobar',
          bar: 'barfoo',
        },
      }),
    ).toStrictEqual<TestResponseTwoBody>({
      foo: 'foobar',
      bar: 'barfoo',
    })
  });
});

describe('create()', () => {
  it('with response one, type and name, returns response', (): void => {
    expect(
      create<TestResponseOne>('response:test:one', false),
    ).toStrictEqual<TestResponseOne>({
      type: 'response:test:one',
      value: false,
    });
  });

  it('with response two, type and name, returns response', (): void => {
    expect(
      create<TestResponseTwo>('response:test:two', {
        foo: 'hello',
        bar: 'world',
      }),
    ).toStrictEqual<TestResponseTwo>({
      type: 'response:test:two',
      value: {
        foo: 'hello',
        bar: 'world',
      },
    });
  });
});

describe('nothing()', () => {
  it('returns nothing type', (): void => {
    expect(
      nothing(),
    ).toStrictEqual<HandlerResponsePresetNothing>({
      type: 'response:nothing',
      value: undefined,
    });
  });
  });
