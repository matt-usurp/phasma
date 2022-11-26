/**
 * The {@link HttpBodyEncoder} result details.
 */
export type HttpBodyEncoderResult = {
  readonly mime: string;
  readonly value: string;
};

/**
 * A function that takes the given {@link value} and serialises (encodes) it to some string format.
 */
export type HttpBodyEncoder = (value: unknown) => HttpBodyEncoderResult;

/**
 * A function that takes the given serialised (encoded) {@link value} and returns {@link T}.
 */
export type HttpBodyDecoder<T> = (value: string) => T | undefined;
