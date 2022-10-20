import { fn, partial } from '@matt-usurp/grok/testing';
import type { HandlerResponseConstraint } from '@phasma/handler/src/component/response';
import type { HttpBodyDecoder } from '@phasma/handler/src/http/body';
import { error } from '@phasma/handler/src/http/response';
import type { HttpValidatorFunction, HttpValidatorFunctionResultFailure, HttpValidatorFunctionResultSuccess } from '@phasma/handler/src/http/validator';
import type { FromType } from '@phasma/handler/src/http/validator/zod';
import { z, ZodIssue } from 'zod';
import type { Event, Provider } from '../../index';
import { WithHttpRequestBody, WithHttpRequestBodyContext, WithHttpRequestBodyResponseError, WithHttpRequestBodyUsingZod } from './http-request-body';

describe(WithHttpRequestBody.name, (): void => {
  describe('constructor()', (): void => {
    it('with payload, undefined, return http error, body missing', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoder = fn<HttpBodyDecoder<any>>();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validator = fn<HttpValidatorFunction<any, unknown>>();

      const middleware = new WithHttpRequestBody(decoder, validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: undefined,
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<WithHttpRequestBodyResponseError.BodyMissing>(
        error<WithHttpRequestBodyResponseError.BodyMissing>(
          'body',
          'missing',
        ),
      );

      expect(decoder).toBeCalledTimes(0);

      expect(validator).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(0);
    });

    it('with payload, empty string, return http error, missing', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoder = fn<HttpBodyDecoder<any>>();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validator = fn<HttpValidatorFunction<any, unknown>>();

      const middleware = new WithHttpRequestBody(decoder, validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: '',
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<WithHttpRequestBodyResponseError.BodyMissing>(
        error<WithHttpRequestBodyResponseError.BodyMissing>(
          'body',
          'missing',
        ),
      );

      expect(decoder).toBeCalledTimes(0);

      expect(validator).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(0);
    });

    it('with payload, decoder called, returns error, return http error, malformed', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoder = fn<HttpBodyDecoder<any>>();

      decoder.mockImplementationOnce((): undefined => {
        return undefined;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validator = fn<HttpValidatorFunction<any, unknown>>();

      const middleware = new WithHttpRequestBody(decoder, validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: 'test:provider:event:body:malformed',
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<WithHttpRequestBodyResponseError.BodyMalformed>(
        error<WithHttpRequestBodyResponseError.BodyMalformed>(
          'body',
          'malformed',
        ),
      );

      expect(decoder).toBeCalledTimes(1);
      expect(decoder).toBeCalledWith<[string]>('test:provider:event:body:malformed');

      expect(validator).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(0);
    });

    it('with payload, decoder called, validator called, returns error, return http error, validation error', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoder = fn<HttpBodyDecoder<any>>();

      decoder.mockImplementationOnce((): string => {
        return 'test:decoder:success';
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validator = fn<HttpValidatorFunction<any, unknown>>();

      validator.mockImplementationOnce((): HttpValidatorFunctionResultFailure<string[]> => {
        return {
          success: false,
          errors: [
            'test:validator:error:a',
            'test:validator:error:b',
            'test:validator:error:c',
            'test:validator:error:d',
          ],
        };
      });

      const middleware = new WithHttpRequestBody(decoder, validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: 'test:provider:event:body:invalid',
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<WithHttpRequestBodyResponseError.BodyValidationFailure<string[]>>(
        error<WithHttpRequestBodyResponseError.BodyValidationFailure<string[]>>(
          'body',
          'validation',
          [
            'test:validator:error:a',
            'test:validator:error:b',
            'test:validator:error:c',
            'test:validator:error:d',
          ],
        ),
      );

      expect(decoder).toBeCalledTimes(1);
      expect(decoder).toBeCalledWith<[string]>('test:provider:event:body:invalid');

      expect(validator).toBeCalledTimes(1);
      expect(validator).toBeCalledWith<[string]>('test:decoder:success');

      expect(next).toBeCalledTimes(0);
    });

    it('with payload, decoder called, validator called, next called, with body context', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const decoder = fn<HttpBodyDecoder<any>>();

      decoder.mockImplementationOnce((): string => {
        return 'test:decoder:success';
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validator = fn<HttpValidatorFunction<any, unknown>>();

      validator.mockImplementationOnce((): HttpValidatorFunctionResultSuccess<string[]> => {
        return {
          success: true,
          data: [
            'test:validator:data:a',
            'test:validator:data:b',
            'test:validator:data:c',
            'test:validator:data:d',
          ],
        };
      });

      const middleware = new WithHttpRequestBody(decoder, validator);

      const next = vi.fn();

      next.mockImplementationOnce(async (): Promise<HandlerResponseConstraint> => {
        return {
          type: 'response:example',
          value: 'test:middleware:next:response',
        };
      });

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: 'test:provider:event:body',
            }),
          }),

          context: {
            inherit: 'test:context:inherit',
          } as any, // eslint-disable-line @typescript-eslint/no-explicit-any

          next,
        }),
      ).toStrictEqual<HandlerResponseConstraint>({
        type: 'response:example',
        value: 'test:middleware:next:response',
      });

      expect(decoder).toBeCalledTimes(1);
      expect(decoder).toBeCalledWith<[string]>('test:provider:event:body');

      expect(validator).toBeCalledTimes(1);
      expect(validator).toBeCalledWith<[string]>('test:decoder:success');

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith<[WithHttpRequestBodyContext<string[]> & { inherit: string }]>({
        inherit: 'test:context:inherit',

        body: [
          'test:validator:data:a',
          'test:validator:data:b',
          'test:validator:data:c',
          'test:validator:data:d',
        ],
      });
    });
  });
});

describe(WithHttpRequestBodyUsingZod.name, (): void => {
  describe('zod()', (): void => {
    it('with body, json malformed, returns http error, malformed', async (): Promise<void> => {
      type TestBodyMapping = {
        readonly name: string;
        readonly age: number;
      };

      const middleware = new WithHttpRequestBodyUsingZod<TestBodyMapping>(
        z.object<FromType<TestBodyMapping>>({
          name: z.string(),
          age: z.number(),
        }),
      );

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: '{b"r[o]ke"n}}',
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<WithHttpRequestBodyResponseError.BodyMalformed>(
        error<WithHttpRequestBodyResponseError.BodyMalformed>(
          'body',
          'malformed',
        ),
      );

      expect(next).toBeCalledTimes(0);
    });

    it('with body, json decoded, schema invalid, returns http error, validation error', async (): Promise<void> => {
      type TestBodyMapping = {
        readonly name: string;
        readonly age: number;
      };

      const middleware = new WithHttpRequestBodyUsingZod<TestBodyMapping>(
        z.object<FromType<TestBodyMapping>>({
          name: z.string(),
          age: z.number(),
        }),
      );

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: JSON.stringify({}),
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<WithHttpRequestBodyResponseError.BodyValidationFailure<ZodIssue[]>>(
        error<WithHttpRequestBodyResponseError.BodyValidationFailure<ZodIssue[]>>(
          'body',
          'validation',
          [
            expect.objectContaining({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['name'],
            }),
            expect.objectContaining({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['age'],
            }),
          ],
        ),
      );

      expect(next).toBeCalledTimes(0);
    });

    it('with body, json decoded, schema validates, next called, with body context', async (): Promise<void> => {
      type TestBodyMapping = {
        readonly name: string;
        readonly age: number;
      };

      const middleware = new WithHttpRequestBodyUsingZod<TestBodyMapping>(
        z.object<FromType<TestBodyMapping>>({
          name: z.string(),
          age: z.number(),
        }),
      );

      const next = vi.fn();

      next.mockImplementationOnce(async (): Promise<HandlerResponseConstraint> => {
        return {
          type: 'response:example',
          value: 'test:middleware:next:response',
        };
      });

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: JSON.stringify({
                name: 'test:body:name',
                age: 40,
              }),
            }),
          }),

          context: {
            inherit: 'test:context:inherit',
          } as any, // eslint-disable-line @typescript-eslint/no-explicit-any

          next,
        }),
      ).toStrictEqual<HandlerResponseConstraint>({
        type: 'response:example',
        value: 'test:middleware:next:response',
      });

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith<[WithHttpRequestBodyContext<TestBodyMapping> & { inherit: string }]>({
        inherit: 'test:context:inherit',

        body: {
          name: 'test:body:name',
          age: 40,
        },
      });
    });
  });
});
