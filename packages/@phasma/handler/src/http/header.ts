export type HttpResponseHeaderValue = string | number;
export type HttpResponseHeaderMapping = Record<string, HttpResponseHeaderValue>;

/**
 * Ensures the given value is an object that can be used as {@link HttpResponseHeaderMapping}.
 * If not an empty object is returned, allowing for easier header merges.
 */
export const ensure = (value: unknown): HttpResponseHeaderMapping => {
  if (typeof value === 'object' && value !== null) {
    return value as HttpResponseHeaderMapping;
  }

  return {};
};
