import { z, ZodIssue } from 'zod';
import type { HttpValidatorFunctionResultFailure, HttpValidatorFunctionResultSuccess } from '../validator';
import { validate } from './zod';

describe('validate()', (): void => {
  it('with schema, simple string, valid, return string', (): void => {
    const schema = z.string();

    const parsed = validate(schema)('something');

    expect(parsed).toStrictEqual<HttpValidatorFunctionResultSuccess<string>>({
      success: true,
      data: 'something',
    });
  });

  it('with schema, object, valid, return object', (): void => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const parsed = validate(schema)({
      name: 'foobar',
      age: 300,
    });

    expect(parsed).toStrictEqual<HttpValidatorFunctionResultSuccess<unknown>>({
      success: true,
      data: {
        name: 'foobar',
        age: 300,
      },
    });
  });

  it('with schema, string, given number, return error', (): void => {
    const schema = z.string();

    const parsed = validate(schema)(123 as unknown as string);

    expect(parsed).toStrictEqual<HttpValidatorFunctionResultFailure<ZodIssue[]>>({
      success: false,
      errors: [
        expect.objectContaining<Partial<ZodIssue>>({
          code: 'invalid_type',
        }),
      ],
    });
  });

  it('with schema, object, given invalid properties, return error', (): void => {
    const schema = z.object({
      name: z.string().nonempty(),
      age: z.number().max(30),
    });

    const parsed = validate(schema)({
      name: '',
      age: 31,
    });

    expect(parsed).toStrictEqual<HttpValidatorFunctionResultFailure<ZodIssue[]>>({
      success: false,
      errors: [
        expect.objectContaining<Partial<ZodIssue>>({
          code: 'too_small',
          path: ['name'],
        }),
        expect.objectContaining<Partial<ZodIssue>>({
          code: 'too_big',
          path: ['age'],
        }),
      ],
    });
  });
});
