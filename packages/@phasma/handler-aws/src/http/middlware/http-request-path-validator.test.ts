import type { Grok } from '@matt-usurp/grok';
import { fn, partial } from '@matt-usurp/grok/testing';
import type { HandlerResponseConstraint } from '@phasma/handler/src/component/response';
import type { HttpValidatorFunction, HttpValidatorFunctionResultFailure, HttpValidatorFunctionResultSuccess } from '@phasma/handler/src/http/validator';
import { FromType } from '@phasma/handler/src/http/validator/zod';
import { z } from 'zod';
import { LambdaHandlerProviderWithEventFromEventSourceIdentifier } from '../../component/provider';
import type { Event } from '../../index';
import { HttpRequestPathValidatorContext, HttpRequestPathValidatorErrorResponse, HttpRequestPathValidatorMiddleware } from './http-request-path-validator';

describe(HttpRequestPathValidatorMiddleware.name, (): void => {
  describe('create()', (): void => {
    it('with path, undefined, return error', async (): Promise<void> => {
      const validator = fn<HttpValidatorFunction<Grok.Constraint.Anything, unknown>>();

      const middleware = HttpRequestPathValidatorMiddleware.create(validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          // Provider is ignore for this middleware
          provider: partial<LambdaHandlerProviderWithEventFromEventSourceIdentifier<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              pathParameters: undefined,
            }),
          }),

          // Context is ignored for this middleware
          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestPathValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: undefined,
        },
      });

      expect(validator).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(0);
    });

    it('with path, validator returns error, return error', async (): Promise<void> => {
      const validator = fn<HttpValidatorFunction<Grok.Constraint.Anything, unknown>>();

      validator.mockImplementationOnce((value: unknown): HttpValidatorFunctionResultFailure<unknown> => {
        expect(value).toStrictEqual('value:provider:payload:path:invalid');

        return {
          success: false,
          errors: 'test-action:validator:errors',
        };
      });

      const middleware = HttpRequestPathValidatorMiddleware.create(validator);

      const next = vi.fn();

      expect(
        await middleware.invoke({
          // Provider is ignore for this middleware
          provider: partial<LambdaHandlerProviderWithEventFromEventSourceIdentifier<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              pathParameters: 'value:provider:payload:path:invalid' as unknown as Record<string, string>,
            }),
          }),

          // Context is ignored for this middleware
          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestPathValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: 'test-action:validator:errors',
        },
      });

      expect(validator).toBeCalledTimes(1);

      expect(next).toBeCalledTimes(0);
    });

    it('with path, validates, calls next with context', async (): Promise<void> => {
      const validator = fn<HttpValidatorFunction<Grok.Constraint.Anything, unknown>>();

      validator.mockImplementationOnce((value: unknown): HttpValidatorFunctionResultSuccess<unknown> => {
        expect(value).toStrictEqual({
          foo: 'bar',
        });

        return {
          success: true,
          data: 'test-action:validator:success',
        };
      });

      const middleware = HttpRequestPathValidatorMiddleware.create(validator);

      const next = vi.fn();

      next.mockImplementationOnce(async (context: HttpRequestPathValidatorContext<unknown>): Promise<HandlerResponseConstraint> => {
        expect(context.path).toStrictEqual('test-action:validator:success');

        return {
          type: 'response:example',
          value: 'test-action:middleware:next:success',
        };
      });

      expect(
        await middleware.invoke({
          // Provider is ignore for this middleware
          provider: partial<LambdaHandlerProviderWithEventFromEventSourceIdentifier<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              pathParameters: {
                foo: 'bar',
              },
            }),
          }),

          // Context is ignored for this middleware
          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HandlerResponseConstraint>({
        type: 'response:example',
        value: 'test-action:middleware:next:success',
      });

      expect(validator).toBeCalledTimes(1);

      expect(next).toBeCalledTimes(1);
    });
  });

  describe('zod()', (): void => {
    it('with body, zod schema invalid, returns error', async (): Promise<void> => {
      type TestPathMapping = {
        user: string;
        session: string;
      };

      const middleware = HttpRequestPathValidatorMiddleware.zod<TestPathMapping>(
        z.object<FromType<TestPathMapping>>({
          user: z.string(),
          session: z.string(),
        }),
      );

      const next = vi.fn();

      expect(
        await middleware.invoke({
          provider: partial<LambdaHandlerProviderWithEventFromEventSourceIdentifier<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              pathParameters: {
                user: 'some-user',
              },
            }),
          }),

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestPathValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: [
            expect.objectContaining({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['session'],
            }),
          ],
        },
      });

      expect(next).toBeCalledTimes(0);
    });

    it('with body, zod schema validates, invokes next with context', async (): Promise<void> => {
      type TestPathMapping = {
        user: string;
        session: string;
      };

      const middleware = HttpRequestPathValidatorMiddleware.zod<TestPathMapping>(
        z.object<FromType<TestPathMapping>>({
          user: z.string(),
          session: z.string(),
        }),
      );

      const next = vi.fn();

      next.mockImplementationOnce(async (context: HttpRequestPathValidatorContext<unknown>): Promise<HandlerResponseConstraint> => {
        expect(context.path).toStrictEqual<TestPathMapping>({
          user: 'some-user',
          session: 'some-session',
        });

        return {
          type: 'response:example',
          value: 'test-action:middleware:next:success',
        };
      });

      expect(
        await middleware.invoke({
          provider: partial<LambdaHandlerProviderWithEventFromEventSourceIdentifier<'apigw:proxy:v2'>>({
            id: 'provider:aws:lambda',

            event: partial<Event.Payload<'apigw:proxy:v2'>>({
              pathParameters: {
                user: 'some-user',
                session: 'some-session',
              },
            }),
          }),

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
