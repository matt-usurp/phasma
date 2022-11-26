export type HttpBodyEncoderResult = {
  readonly mime: string;
  readonly value: string;
};

export type HttpBodyEncoder = (value: unknown) => HttpBodyEncoderResult;
export type HttpBodyDecoder<T> = (value: string) => T | undefined;
