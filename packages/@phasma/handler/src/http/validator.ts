import { ZodIssue, ZodSchema } from 'zod';

export type HttpValidatorFunctionResultSuccess<T> = {
  success: true;
  data: T;
};

export type HttpValidatorFunctionResultFailure<E> = {
  success: false;
  errors: E;
};

export type HttpValidatorFunctionResult<T, E> = (
  | HttpValidatorFunctionResultSuccess<T>
  | HttpValidatorFunctionResultFailure<E>
);

export type HttpValidatorFunction<T, E> = (value: Partial<T>) => HttpValidatorFunctionResult<T, E>;

/**
 * An implementation of the validator using `zod`.
 * This will create a validator from the given schema.
 */
export const zod = <T>(schema: ZodSchema<T>): HttpValidatorFunction<T, ZodIssue[]> => (value) => {
  const parsed = schema.safeParse(value);

  if (parsed.success === true) {
    return {
      success: true,
      data: parsed.data,
    };
  }

  return {
    success: false,
    errors: parsed.error.issues,
  };
};
