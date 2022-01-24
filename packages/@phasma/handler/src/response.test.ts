import { HandlerResponse, HandlerResponsePresetNothing } from './component/response';
import { create, nothing } from './response';

type TestResponseOne = HandlerResponse<'response:test:one', boolean>;
type TestResponseTwo = HandlerResponse<'response:test:two', {
  readonly foo: string;
  readonly bar: string;
}>;

describe('response', (): void => {
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
});
