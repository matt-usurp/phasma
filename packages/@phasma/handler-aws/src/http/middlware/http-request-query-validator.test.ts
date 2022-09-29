import { fn, partial } from '@matt-usurp/grok/testing';
import type { HandlerResponseConstraint } from '@phasma/handler/src/component/response';
import type { HttpQueryParser } from '@phasma/handler/src/http/query';
import { error } from '@phasma/handler/src/http/response';
import type { HttpValidatorFunction, HttpValidatorFunctionResultFailure, HttpValidatorFunctionResultSuccess } from '@phasma/handler/src/http/validator';
import type { FromType } from '@phasma/handler/src/http/validator/zod';
import { z, ZodIssue } from 'zod';
import type { Event, Provider } from '../../index';
import { HttpRequestQueryValidatorContext, HttpRequestQueryValidatorMiddleware, HttpRequestQueryValidatorMiddlewareUsingZod, HttpRequestQueryValidatorResponseError } from './http-request-query-validator';

describe(HttpRequestQueryValidatorMiddleware.name, (): void => {
  describe('constructor()', (): void => {
    it('with query, undefined, parser called, returns undefined, return http error, malformed request', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parser = fn<HttpQueryParser<any>>();

      parser.mockImplementationOnce((): undefined => {
        return undefined;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validator = fn<HttpValidatorFunction<any, unknown>>();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const middleware = new HttpRequestQueryValidatorMiddleware<any, unknown>(parser, validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              rawQueryString: undefined,
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestQueryValidatorResponseError.QueryStringMalformed>(
        error<HttpRequestQueryValidatorResponseError.QueryStringMalformed>(
          'query',
          'malformed',
        ),
      );

      expect(parser).toBeCalledTimes(1);
      expect(parser).toBeCalledWith<[string]>('');

      expect(validator).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(0);
    });

    it('with query, parser called, returns undefined, return http error, malformed request', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parser = fn<HttpQueryParser<any>>();

      parser.mockImplementationOnce((): undefined => {
        return undefined;
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const validator = fn<HttpValidatorFunction<any, unknown>>();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const middleware = new HttpRequestQueryValidatorMiddleware<any, unknown>(parser, validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              rawQueryString: 'test:provider:event:query',
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestQueryValidatorResponseError.QueryStringMalformed>(
        error<HttpRequestQueryValidatorResponseError.QueryStringMalformed>(
          'query',
          'malformed',
        ),
      );

      expect(parser).toBeCalledTimes(1);
      expect(parser).toBeCalledWith<[string]>('test:provider:event:query');

      expect(validator).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(0);
    });

    it('with query, parser called, validator called, returns error, return http error, validation error', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parser = fn<HttpQueryParser<any>>();

      parser.mockImplementationOnce((): string => {
        return 'test:parser:success';
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
          ],
        };
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const middleware = new HttpRequestQueryValidatorMiddleware<any, unknown>(parser, validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              rawQueryString: 'test:provider:event:query',
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestQueryValidatorResponseError.QueryValidationFailure<string[]>>(
        error<HttpRequestQueryValidatorResponseError.QueryValidationFailure<string[]>>(
          'query',
          'validation',
          [
            'test:validator:error:a',
            'test:validator:error:b',
            'test:validator:error:c',
          ],
        ),
      );

      expect(parser).toBeCalledTimes(1);
      expect(parser).toBeCalledWith<[string]>('test:provider:event:query');

      expect(validator).toBeCalledTimes(1);
      expect(validator).toBeCalledWith<[string]>('test:parser:success');

      expect(next).toBeCalledTimes(0);
    });

    it('with query, parser called, validator called, passes, next called, with query context', async (): Promise<void> => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parser = fn<HttpQueryParser<any>>();

      parser.mockImplementationOnce((): string => {
        return 'test:parser:success';
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
          ],
        };
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const middleware = new HttpRequestQueryValidatorMiddleware<any, unknown>(parser, validator);

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
              rawQueryString: 'test:provider:event:query',
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

      expect(parser).toBeCalledTimes(1);
      expect(parser).toBeCalledWith<[string]>('test:provider:event:query');

      expect(validator).toBeCalledTimes(1);
      expect(validator).toBeCalledWith<[string]>('test:parser:success');

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith<[HttpRequestQueryValidatorContext<string[]> & { inherit: string }]>({
        inherit: 'test:context:inherit',

        query: [
          'test:validator:data:a',
          'test:validator:data:b',
          'test:validator:data:c',
        ],
      });
    });
  });
});

describe(HttpRequestQueryValidatorMiddlewareUsingZod.name, (): void => {
  describe('constructor()', (): void => {
    it('with query, invalid, parser called, returns empty object, validate called, schema invalid, return http error, validation error', async (): Promise<void> => {
      type TestQueryMapping = {
        readonly a: string;
        readonly b: string;
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const middleware = new HttpRequestQueryValidatorMiddlewareUsingZod<any>(
        z.object<FromType<TestQueryMapping>>({
          a: z.string(),
          b: z.string(),
        }),
      );

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              rawQueryString: '==',
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestQueryValidatorResponseError.QueryValidationFailure<ZodIssue[]>>(
        error<HttpRequestQueryValidatorResponseError.QueryValidationFailure<ZodIssue[]>>(
          'query',
          'validation',
          [
            expect.objectContaining({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['a'],
            }),
            expect.objectContaining({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['b'],
            }),
          ],
        ),
      );

      expect(next).toBeCalledTimes(0);
    });

    it('with query, parsed called, schema invalid, return http error, validation error', async (): Promise<void> => {
      type TestQueryMapping = {
        readonly a: string;
        readonly b: string;
      };

      const middleware = new HttpRequestQueryValidatorMiddlewareUsingZod<TestQueryMapping>(
        z.object<FromType<TestQueryMapping>>({
          a: z.string(),
          b: z.string(),
        }),
      );

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<Provider.ForEvent<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              rawQueryString: 'c=d',
            }),
          }),

          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestQueryValidatorResponseError.QueryValidationFailure<ZodIssue[]>>(
        error<HttpRequestQueryValidatorResponseError.QueryValidationFailure<ZodIssue[]>>(
          'query',
          'validation',
          [
            expect.objectContaining({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['a'],
            }),
            expect.objectContaining({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['b'],
            }),
          ],
        ),
      );

      expect(next).toBeCalledTimes(0);
    });

    it('with query, query parses, schema validates, invokes next with context', async (): Promise<void> => {
      type TestQueryMapping = {
        readonly a: string;
        readonly b: string;
      };

      const middleware = new HttpRequestQueryValidatorMiddlewareUsingZod<TestQueryMapping>(
        z.object<FromType<TestQueryMapping>>({
          a: z.string(),
          b: z.string(),
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
              rawQueryString: 'a=value-a&b=value-b',
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
      expect(next).toBeCalledWith<[HttpRequestQueryValidatorContext<TestQueryMapping> & { inherit: string }]>({
        inherit: 'test:context:inherit',

        query: {
          a: 'value-a',
          b: 'value-b',
        },
      });
    });
  });
});
