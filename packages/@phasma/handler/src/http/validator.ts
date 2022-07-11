export type HttpValidatorFunctionResultSuccess<T> = {
  success: true;
  data: T;
};

export type HttpValidatorFunctionResultFailure<E> = {
  success: false;
  errors: E;
};

export type HttpValidatorFunctionResult<T, E> = (
  | HttpValidatorFunctionResultSuccess<T>
  | HttpValidatorFunctionResultFailure<E>
);

export type HttpValidatorFunction<T, E> = (value: Partial<T>) => HttpValidatorFunctionResult<T, E>;
