export type HttpBodyEncoderResult = {
  mime: string;
  value: string;
};

export type HttpBodyEncoder = (value: unknown) => HttpBodyEncoderResult;
export type HttpBodyDecoder<T> = (value: string) => T | undefined;
