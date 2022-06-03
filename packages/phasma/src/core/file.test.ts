import { common, extensionless } from './file';

describe('common()', (): void => {
  it('with filepaths, resolves to common relative', (): void => {
    expect(
      common(
        '/a/b/c/d/e/f/g/file.ext',
        '/a/b/c/d/e',
      ),
    ).toStrictEqual('f/g/file.ext');
  });
});

describe('extensionless()', (): void => {
  it('with filepath, with extension, returns without extension', (): void => {
    expect(
      extensionless('foo/bar.dat'),
    ).toStrictEqual('foo/bar');
  });

  it('with filepath, with extension, with root, returns without extension', (): void => {
    expect(
      extensionless('/something/another.txt'),
    ).toStrictEqual('/something/another');
  });

  it('with filename, with extension, returns without extension', (): void => {
    expect(
      extensionless('game.dat'),
    ).toStrictEqual('game');
  });
});
