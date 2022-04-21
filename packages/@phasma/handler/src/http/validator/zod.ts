import type { ZodBoolean, ZodIssue, ZodNumber, ZodObject, ZodSchema, ZodString, ZodTypeAny } from 'zod';
import type { HttpValidatorFunction } from '../validator';

export type { ZodIssue, ZodSchema } from 'zod';

export type FromType<T> = (
  T extends string
    ? ZodString
    : (
      T extends number
        ? ZodNumber
        : (
          T extends boolean
            ? ZodBoolean
            : (
              T extends Record<string, unknown>
                ? { [K in keyof T]: FromTypeRecursive<T[K]> }
                : never
            )
        )
    )
);

export type FromTypeRecursive<T> = (
  T extends string
    ? ZodString
    : (
      T extends number
        ? ZodNumber
        : (
          T extends boolean
            ? ZodBoolean
            : (
              T extends Record<string, unknown>
                ? ZodObject<{ [K in keyof T]: FromTypeRecursive<T[K]> }, 'strip', ZodTypeAny, T, T>
                : never
            )
        )
    )
);

/**
 * An implementation of the validator using `zod`.
 * This will create a validator from the given schema.
 */
export const validate = <T>(schema: ZodSchema<T>): HttpValidatorFunction<T, ZodIssue[]> => (value) => {
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
