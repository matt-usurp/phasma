export namespace HttpValidatorFunctionResult {
  /**
   * A {@link HttpValidatorFunction} success result with data of type {@link T}.
   */
  export type ValidatorSuccess<T> = {
    success: true;
    data: T;
  };

  /**
   * A {@link HttpValidatorFunction} failure result with error of type {@link E}.
   */
  export type ValidatorFailure<E> = {
    success: false;
    errors: E;
  };
}

/**
 * A union of possible results a {@link HttpValidatorFunction} implementation.
 */
export type HttpValidatorFunctionResult<T, E> = (
  | HttpValidatorFunctionResult.ValidatorSuccess<T>
  | HttpValidatorFunctionResult.ValidatorFailure<E>
);

/**
 * A function that can validate the given {@link value}.
 */
export type HttpValidatorFunction<T, E> = (value: Partial<T>) => HttpValidatorFunctionResult<T, E>;
