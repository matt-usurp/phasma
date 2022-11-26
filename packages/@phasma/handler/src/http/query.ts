import { parse as qsparse, stringify as qsstringify } from 'qs';

/**
 * A function that can parse the given {@link querystring} into {@link T}.
 */
export type HttpQueryParser<T> = (querystring: string) => T | undefined;

/**
 * A function that can convert the given {@link data} into a query string.
 */
export type HttpQueryStringer = (data: unknown) => string;

/**
 * A {@link HttpQueryParser} implementation using the `qs` package.
 */
export const parse = <T>(querystring: string): T => {
  return qsparse(querystring, {
    allowDots: true,
    comma: true,
  }) as unknown as T;
};

export const stringify = (data: unknown): string => {
  return qsstringify(data, {
    allowDots: true,
    arrayFormat: 'comma',
    encode: false,
  });
};
