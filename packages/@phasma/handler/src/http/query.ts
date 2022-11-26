import { parse as qsparse } from 'qs';

/**
 * A function that can parse the given {@link querystring} into {@link T}.
 */
export type HttpQueryParser<T> = (querystring: string) => T | undefined;

/**
 * A {@link HttpQueryParser} implementation using the `qs` package.
 */
export const parse = <T>(querystring: string): T => {
  return qsparse(querystring, {
    allowDots: true,
    comma: true,
  }) as unknown as T;
};
