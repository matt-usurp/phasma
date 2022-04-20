import { parse as qsparse } from 'qs';

export type HttpQueryParser<T> = (value: string) => T | undefined;

export const parse = <T>(value: string): T => {
  return qsparse(value, {
    allowDots: true,
    comma: true,
  }) as unknown as T;
};
