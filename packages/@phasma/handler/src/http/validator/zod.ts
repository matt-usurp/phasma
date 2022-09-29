import type { ZodBoolean, ZodIssue, ZodNumber, ZodObject, ZodSchema, ZodString } from 'zod';
import type { HttpValidatorFunction } from '../validator';

export type FromType<T> = (
  T extends Record<string, unknown>
    // the first level object for zod is not expected to be a `ZodObject` when used as the generic parameter to `z.object()`.
    // otherwise when matching against `typeof z.object()` it does need to be wrapped in `ZodObject`.
    ? { [K in keyof T]: FromType.FromTypeRecursive<T[K]> }
    : FromType.FromTypeRecursive<T>
);

export namespace FromType {
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
                  ? ZodObject<{ [K in keyof T]: FromTypeRecursive<T[K]> }>
                  : never
              )
          )
      )
  );
}

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
