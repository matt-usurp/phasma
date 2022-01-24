import { entrypoint, factory, id } from './core/provider';
import * as index from './index';

describe('index', (): void => {
  describe('exports', (): void => {
    // core/provider
    it('exports id', () => expect(index.id).toStrictEqual(id));
    it('exports factory, as aws', () => expect(index.aws).toStrictEqual(factory));
    it('exports entrypoint, as awse', () => expect(index.awse).toStrictEqual(entrypoint));
  });
});
