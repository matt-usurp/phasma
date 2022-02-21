export type HttpBodyTransformerResult = {
  mime: string;
  value: string;
};

export type HttpBodyTransformer = (value: unknown) => HttpBodyTransformerResult;

/**
 * Helper function to encode json values for use with http responses.
 * This will ignore all values that could mean "empty response".
 */
export const json: HttpBodyTransformer = (value) => {
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
