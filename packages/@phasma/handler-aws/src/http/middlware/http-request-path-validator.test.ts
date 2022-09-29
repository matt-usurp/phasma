import { fn, partial } from '@matt-usurp/grok/testing';
import type { HandlerResponseConstraint } from '@phasma/handler/src/component/response';
import { error } from '@phasma/handler/src/http/response';
import type { HttpValidatorFunction, HttpValidatorFunctionResultFailure, HttpValidatorFunctionResultSuccess } from '@phasma/handler/src/http/validator';
import type { FromType } from '@phasma/handler/src/http/validator/zod';
import { z, ZodIssue } from 'zod';
import type { Event, Provider } from '../../index';
import { HttpRequestPathValidatorContext, HttpRequestPathValidatorMiddleware, HttpRequestPathValidatorMiddlewareUsingZod, HttpRequestPathValidatorResponseError } from './http-request-path-validator';

describe(HttpRequestPathValidatorMiddleware.name, (): void => {
  describe('constructor()', (): void => {
    it('with path, undefined, return http error, missing', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validator = fn<HttpValidatorFunction<any, unknown>>();

      const middleware = new HttpRequestPathValidatorMiddleware(validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              pathParameters: undefined,
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestPathValidatorResponseError.PathMissing>(
        error<HttpRequestPathValidatorResponseError.PathMissing>(
          'path',
          'missing',
        ),
      );

      expect(validator).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(0);
    });

    it('with path, validator called, returns error, return http error, validation error', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validator = fn<HttpValidatorFunction<any, unknown>>();

      validator.mockImplementationOnce((): HttpValidatorFunctionResultFailure<string[]> => {
        return {
          success: false,
          errors: [
            'test:validator:error:a',
            'test:validator:error:b',
          ],
        };
      });

      const middleware = new HttpRequestPathValidatorMiddleware(validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              pathParameters: 'test:provider:event:path:invalid' as any,
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestPathValidatorResponseError.PathValidationFailure<string[]>>(
        error<HttpRequestPathValidatorResponseError.PathValidationFailure<string[]>>(
          'path',
          'validation',
          [
            'test:validator:error:a',
            'test:validator:error:b',
          ],
        ),
      );

      expect(validator).toBeCalledTimes(1);
      expect(validator).toBeCalledWith<[string]>('test:provider:event:path:invalid');

      expect(next).toBeCalledTimes(0);
    });

    it('with path, validator called, passes, next called, with path context', async (): Promise<void> => {
      type TestPathMapping = {
        readonly a: string;
        readonly b: string;
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validator = fn<HttpValidatorFunction<any, unknown>>();

      validator.mockImplementationOnce((): HttpValidatorFunctionResultSuccess<string[]> => {
        return {
          success: true,
          data: [
            'test:validator:data:a',
            'test:validator:data:b',
          ],
        };
      });

      const middleware = new HttpRequestPathValidatorMiddleware(validator);

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
              pathParameters: {
                a: 'test:path:a',
                b: 'test:path:b',
              },
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

      expect(validator).toBeCalledTimes(1);
      expect(validator).toBeCalledWith<[TestPathMapping]>({
        a: 'test:path:a',
        b: 'test:path:b',
      });

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith<[HttpRequestPathValidatorContext<string[]> & { inherit: string }]>({
        inherit: 'test:context:inherit',

        path: [
          'test:validator:data:a',
          'test:validator:data:b',
        ],
      });
    });
  });
});

describe(HttpRequestPathValidatorMiddlewareUsingZod.name, (): void => {
  describe('constructor()', (): void => {
    it('with path, validator called, schema invalid, returns http error, validation error', async (): Promise<void> => {
      type TestPathMapping = {
        readonly user: string;
        readonly session: string;
      };

      const middleware = new HttpRequestPathValidatorMiddlewareUsingZod<TestPathMapping>(
        z.object<FromType<TestPathMapping>>({
          user: z.string(),
          session: z.string(),
        }),
      );

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              pathParameters: {
                user: 'test:path:user',
              },
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestPathValidatorResponseError.PathValidationFailure<ZodIssue[]>>(
        error<HttpRequestPathValidatorResponseError.PathValidationFailure<ZodIssue[]>>(
          'path',
          'validation',
          [
            expect.objectContaining({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['session'],
            }),
          ],
        ),
      );

      expect(next).toBeCalledTimes(0);
    });

    it('with path, validator called, schema validates, next called, with path context', async (): Promise<void> => {
      type TestPathMapping = {
        readonly user: string;
        readonly session: string;
      };

      const middleware = new HttpRequestPathValidatorMiddlewareUsingZod<TestPathMapping>(
        z.object<FromType<TestPathMapping>>({
          user: z.string(),
          session: z.string(),
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
              pathParameters: {
                user: 'test:path:user',
                session: 'test:path:session',
              },
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
      expect(next).toBeCalledWith<[HttpRequestPathValidatorContext<TestPathMapping> & { inherit: string }]>({
        inherit: 'test:context:inherit',

        path: {
          user: 'test:path:user',
          session: 'test:path:session',
        },
      });
    });
  });
});
