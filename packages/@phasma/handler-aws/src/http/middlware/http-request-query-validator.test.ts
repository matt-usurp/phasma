import type { Grok } from '@matt-usurp/grok';
import { fn, partial } from '@matt-usurp/grok/testing';
import type { HandlerResponseConstraint } from '@phasma/handler/src/component/response';
import type { HttpQueryParser } from '@phasma/handler/src/http/query';
import type { HttpValidatorFunction, HttpValidatorFunctionResultFailure, HttpValidatorFunctionResultSuccess } from '@phasma/handler/src/http/validator';
import type { FromType } from '@phasma/handler/src/http/validator/zod';
import { z } from 'zod';
import type { Event } from '../../index';
import { HttpRequesQueryValidatorMiddleware, HttpRequestQueryValidatorContext, HttpRequestQueryValidatorErrorResponse } from './http-request-query-validator';

describe(HttpRequesQueryValidatorMiddleware.name, (): void => {
  describe('create()', (): void => {
    it('with query, undefined, return errors', async (): Promise<void> => {
      const parser = fn<HttpQueryParser<Grok.Constraint.Anything>>();
      const validator = fn<HttpValidatorFunction<Grok.Constraint.Anything, unknown>>();

      parser.mockImplementationOnce((value: string) => {
        expect(value).toStrictEqual('');

        return undefined;
      });

      const middleware = HttpRequesQueryValidatorMiddleware.create<Grok.Constraint.Anything>(parser, validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              rawQueryString: undefined,
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestQueryValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: undefined,
        },
      });

      expect(parser).toBeCalledTimes(1);
      expect(validator).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(0);
    });

    it('with query, query parser errors, return errors', async (): Promise<void> => {
      const parser = fn<HttpQueryParser<Grok.Constraint.Anything>>();
      const validator = fn<HttpValidatorFunction<Grok.Constraint.Anything, unknown>>();

      parser.mockImplementationOnce((value: string) => {
        expect(value).toStrictEqual('value:provider:payload:query:invalid');

        return undefined;
      });

      const middleware = HttpRequesQueryValidatorMiddleware.create<Grok.Constraint.Anything>(parser, validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              rawQueryString: 'value:provider:payload:query:invalid',
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestQueryValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: undefined,
        },
      });

      expect(parser).toBeCalledTimes(1);
      expect(validator).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(0);
    });

    it('with query, query parses, validator returns error, return errors', async (): Promise<void> => {
      const parser = fn<HttpQueryParser<Grok.Constraint.Anything>>();
      const validator = fn<HttpValidatorFunction<Grok.Constraint.Anything, unknown>>();

      parser.mockImplementationOnce((value: string) => {
        expect(value).toStrictEqual('value:provider:payload:query:invalid');

        return 'test-action:parser:success';
      });

      validator.mockImplementationOnce((value: unknown): HttpValidatorFunctionResultFailure<unknown> => {
        expect(value).toStrictEqual('test-action:parser:success');

        return {
          success: false,
          errors: 'test-action:validator:errors',
        };
      });

      const middleware = HttpRequesQueryValidatorMiddleware.create<Grok.Constraint.Anything>(parser, validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              rawQueryString: 'value:provider:payload:query:invalid',
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestQueryValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: 'test-action:validator:errors',
        },
      });

      expect(parser).toBeCalledTimes(1);
      expect(validator).toBeCalledTimes(1);

      expect(next).toBeCalledTimes(0);
    });

    it('with query, query parses, validator passes, invokes next with context', async (): Promise<void> => {
      const parser = fn<HttpQueryParser<Grok.Constraint.Anything>>();
      const validator = fn<HttpValidatorFunction<Grok.Constraint.Anything, unknown>>();

      parser.mockImplementationOnce((value: string) => {
        expect(value).toStrictEqual('value:provider:payload:raw-query-string:valid');

        return 'test-action:parser:success';
      });

      validator.mockImplementationOnce((value: unknown): HttpValidatorFunctionResultSuccess<unknown> => {
        expect(value).toStrictEqual('test-action:parser:success');

        return {
          success: true,
          data: 'test-action:validator:success',
        };
      });

      const middleware = HttpRequesQueryValidatorMiddleware.create<Grok.Constraint.Anything>(parser, validator);

      const next = vi.fn();

      next.mockImplementationOnce(async (context: HttpRequestQueryValidatorContext<unknown>): Promise<HandlerResponseConstraint> => {
        expect(context.query).toStrictEqual('test-action:validator:success');

        return {
          type: 'response:example',
          value: 'test-action:middleware:next:success',
        };
      });

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              rawQueryString: 'value:provider:payload:raw-query-string:valid',
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HandlerResponseConstraint>({
        type: 'response:example',
        value: 'test-action:middleware:next:success',
      });

      expect(parser).toBeCalledTimes(1);
      expect(validator).toBeCalledTimes(1);

      expect(next).toBeCalledTimes(1);
    });
  });

  describe('zod()', (): void => {
    it('with query, query parser errors, returns error', async (): Promise<void> => {
      type TestQueryMapping = {
        foo: string;
        bar: string;
      };

      const middleware = HttpRequesQueryValidatorMiddleware.zod<TestQueryMapping>(
        z.object<FromType<TestQueryMapping>>({
          foo: z.string(),
          bar: z.string(),
        }),
      );

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              rawQueryString: '<foo><bar>',
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestQueryValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: [
            expect.objectContaining({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['foo'],
            }),
            expect.objectContaining({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['bar'],
            }),
          ],
        },
      });

      expect(next).toBeCalledTimes(0);
    });

    it('with query, query parses, zod schema invalid, returns error', async (): Promise<void> => {
      type TestQueryMapping = {
        foo: string;
        bar: string;
      };

      const middleware = HttpRequesQueryValidatorMiddleware.zod<TestQueryMapping>(
        z.object<FromType<TestQueryMapping>>({
          foo: z.string(),
          bar: z.string(),
        }),
      );

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              rawQueryString: 'foo=a',
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestQueryValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: [
            expect.objectContaining({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['bar'],
            }),
          ],
        },
      });

      expect(next).toBeCalledTimes(0);
    });

    it('with query, query parses, zod schema validates, invokes next with context', async (): Promise<void> => {
      type TestQueryMapping = {
        foo: string;
        bar: string;
      };

      const middleware = HttpRequesQueryValidatorMiddleware.zod<TestQueryMapping>(
        z.object<FromType<TestQueryMapping>>({
          foo: z.string(),
          bar: z.string(),
        }),
      );

      const next = vi.fn();

      next.mockImplementationOnce(async (context: HttpRequestQueryValidatorContext<unknown>): Promise<HandlerResponseConstraint> => {
        expect(context.query).toStrictEqual<TestQueryMapping>({
          foo: 'a',
          bar: 'b',
        });

        return {
          type: 'response:example',
          value: 'test-action:middleware:next:success',
        };
      });

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              rawQueryString: 'foo=a&bar=b',
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HandlerResponseConstraint>({
        type: 'response:example',
        value: 'test-action:middleware:next:success',
      });

      expect(next).toBeCalledTimes(1);
    });
  });
});
