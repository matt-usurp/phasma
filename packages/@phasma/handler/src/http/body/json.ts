import type { HttpBodyEncoder } from '../body';

/**
 * Encode the given value to a JSON string.
 *
 * Helper function to encode json values for use with http responses.
 * This will ignore all values that could mean "empty response".
 */
export const encoder: HttpBodyEncoder = (value) => {
  if (value === undefined || value === null || value === '') {
    return {
      mime: 'application/json',
      value: '',
    };
  }

  return {
    mime: 'application/json',
    value: JSON.stringify(value),
  };
};

/**
 * Decode the given JSON string.
 */
export const decoder = <T>(value: string): T | undefined => {
  try {
    return JSON.parse(value);
  } catch (_: unknown) {
    return undefined;
  }
};
