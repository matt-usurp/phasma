import { entrypoint, factory, id } from './core/provider';
import * as index from './index';

describe('.id', (): void => {
  it('is forwarded export', () => expect(index.id).toStrictEqual(id));
});

describe('factory()', (): void => {
  it('is forwarded export', () => expect(index.aws).toStrictEqual(factory));
});

describe('entrypoint()', (): void => {
  it('is forward export', () => expect(index.awse).toStrictEqual(entrypoint));
});
