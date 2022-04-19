export type HttpBodyEncoderResult = {
  mime: string;
  value: string;
};

export type HttpBodyEncoder = (value: unknown) => HttpBodyEncoderResult;

/**
 * Helper function to encode json values for use with http responses.
 * This will ignore all values that could mean "empty response".
 */
export const json: HttpBodyEncoder = (value) => {
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
