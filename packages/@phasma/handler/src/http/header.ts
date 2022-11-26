/**
 * The representation of a HTTP header.
 *
 * @todo Remove `number`.
 */
export type HttpHeaderValue = string | number;

/**
 * A mapping of HTTP header like values.
 */
export type HttpHeaderMapping = Record<string, HttpHeaderValue>;

/**
 * Ensures the given value is an object that can be used as {@link HttpHeaderMapping}.
 * If not an empty object is returned, allowing for easier header merges.
 */
export const ensure = (value: unknown): HttpHeaderMapping => {
  if (typeof value === 'object' && value !== null) {
    return value as HttpHeaderMapping;
  }

  return {};
};
