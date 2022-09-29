export type HttpValidatorFunctionResultSuccess<Data> = {
  success: true;
  data: Data;
};

export type HttpValidatorFunctionResultFailure<Error> = {
  success: false;
  errors: Error;
};

export type HttpValidatorFunctionResult<Data, Error> = (
  | HttpValidatorFunctionResultSuccess<Data>
  | HttpValidatorFunctionResultFailure<Error>
);

export type HttpValidatorFunction<Data, Error> = (value: Partial<Data>) => HttpValidatorFunctionResult<Data, Error>;
