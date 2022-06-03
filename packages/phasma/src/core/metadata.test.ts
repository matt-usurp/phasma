import { define, metadata } from './metadata';

describe('define()', (): void => {
  it('with instance, defines metadata, reflection recognises metadata', (): void => {
    class T {}

    expect(Reflect.hasOwnMetadata('phasma:target:filename', T)).toStrictEqual(false);

    define(T, 'phasma:target:filename', 'value-here');

    expect(Reflect.hasOwnMetadata('phasma:target:filename', T)).toStrictEqual(true);

    expect(Reflect.getMetadata('phasma:target:filename', T)).toStrictEqual('value-here');
    expect(Reflect.getMetadata('phasma:invalid', T)).toStrictEqual(undefined);
  });
});

describe('metadata()', (): void => {
  it('with instance, metadata defined, returns metadata', (): void => {
    class T {}

    expect(Reflect.hasOwnMetadata('phasma:target:filename', T)).toStrictEqual(false);

    Reflect.defineMetadata('phasma:target:filename', 'another-here', T);

    expect(Reflect.hasOwnMetadata('phasma:target:filename', T)).toStrictEqual(true);

    expect(metadata(T, 'phasma:target:filename')).toStrictEqual('value-here');
    expect(metadata(T, 'phasma:route:method')).toStrictEqual(undefined);
  });
});
