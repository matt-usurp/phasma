import { json } from './body';

describe('http/body', (): void => {
  describe('json()', (): void => {
    it('with empty value, undefined, return empty string', (): void => {
      expect(
        json(undefined),
      ).toStrictEqual('');
    });

    it('with empty value, null, return empty string', (): void => {
      expect(
        json(null),
      ).toStrictEqual('');
    });

    it('with empty value, empty string, return empty string', (): void => {
      expect(
        json(''),
      ).toStrictEqual('');
    });

    it('with value, return value as json encoded string', (): void => {
      expect(
        json({
          name: 'jane',
        }),
      ).toStrictEqual('{"name":"jane"}');
    });
  });
});
