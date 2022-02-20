import { encode } from './json';

describe('http/encoding/json', (): void => {
  describe('encode()', (): void => {
    it('with empty value, undefined, return empty string', (): void => {
      expect(
        encode(undefined),
      ).toStrictEqual('');
    });

    it('with empty value, null, return empty string', (): void => {
      expect(
        encode(null),
      ).toStrictEqual('');
    });

    it('with empty value, empty string, return empty string', (): void => {
      expect(
        encode(''),
      ).toStrictEqual('');
    });

    it('with value, return value as json encoded string', (): void => {
      expect(
        encode({
          name: 'jane',
        }),
      ).toStrictEqual('{"name":"jane"}');
    });
  });
});
