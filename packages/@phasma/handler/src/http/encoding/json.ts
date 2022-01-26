/**
 * Helper function to encode json values for use with http responses.
 * This will ignore all values that could mean "empty response".
 */
export const encode = (value: unknown): string => {
  if (value === undefined || value === null || value === '') {
    return '';
  }

  return JSON.stringify(value);
};
