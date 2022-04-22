import type { Grok } from '@matt-usurp/grok';
import { fn, partial } from '@matt-usurp/grok/testing';
import type { HandlerResponseConstraint } from '@phasma/handler/src/component/response';
import type { HttpBodyDecoder } from '@phasma/handler/src/http/body';
import type { HttpValidatorFunction, HttpValidatorFunctionResultFailure, HttpValidatorFunctionResultSuccess } from '@phasma/handler/src/http/validator';
import { FromType } from '@phasma/handler/src/http/validator/zod';
import { z, ZodIssue } from 'zod';
import type { Event } from '../../index';
import { HttpRequestBodyValidatorContext, HttpRequestBodyValidatorErrorResponse, HttpRequestBodyValidatorMiddleware } from './http-request-body-validator';

describe(HttpRequestBodyValidatorMiddleware.name, (): void => {
  describe('create()', (): void => {
    it('with payload, undefined, return error', async (): Promise<void> => {
      const decoder = fn<HttpBodyDecoder<Grok.Constraint.Anything>>();
      const validator = fn<HttpValidatorFunction<Grok.Constraint.Anything, unknown>>();

      const middleware = HttpRequestBodyValidatorMiddleware.create(decoder, validator);

      const next = jest.fn();

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: undefined,
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestBodyValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: undefined,
        },
      });

      expect(decoder).toBeCalledTimes(0);
      expect(validator).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(0);
    });

    it('with payload, empty string, return error', async (): Promise<void> => {
      const decoder = fn<HttpBodyDecoder<Grok.Constraint.Anything>>();
      const validator = fn<HttpValidatorFunction<Grok.Constraint.Anything, unknown>>();

      const middleware = HttpRequestBodyValidatorMiddleware.create(decoder, validator);

      const next = jest.fn();

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: '',
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestBodyValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: undefined,
        },
      });

      expect(decoder).toBeCalledTimes(0);
      expect(validator).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(0);
    });

    it('with payload, decoder returns error, return error', async (): Promise<void> => {
      const decoder = fn<HttpBodyDecoder<Grok.Constraint.Anything>>();
      const validator = fn<HttpValidatorFunction<Grok.Constraint.Anything, unknown>>();

      decoder.mockImplementationOnce((value: string): undefined => {
        expect(value).toStrictEqual('value:provider:payload:body:malformed');

        return undefined;
      });

      const middleware = HttpRequestBodyValidatorMiddleware.create(decoder, validator);

      const next = jest.fn();

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: 'value:provider:payload:body:malformed',
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestBodyValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: undefined,
        },
      });

      expect(decoder).toBeCalledTimes(1);
      expect(validator).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(0);
    });

    it('with payload, decodes, validator returns error, return error', async (): Promise<void> => {
      const decoder = fn<HttpBodyDecoder<Grok.Constraint.Anything>>();
      const validator = fn<HttpValidatorFunction<Grok.Constraint.Anything, unknown>>();

      decoder.mockImplementationOnce((value: string): unknown => {
        expect(value).toStrictEqual('value:provider:payload:body:invalid');

        return 'test-action:decoder:success';
      });

      validator.mockImplementationOnce((value: unknown): HttpValidatorFunctionResultFailure<unknown> => {
        expect(value).toStrictEqual('test-action:decoder:success');

        return {
          success: false,
          errors: 'test-action:validator:errors',
        };
      });

      const middleware = HttpRequestBodyValidatorMiddleware.create(decoder, validator);

      const next = jest.fn();

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: 'value:provider:payload:body:invalid',
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestBodyValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: 'test-action:validator:errors',
        },
      });

      expect(decoder).toBeCalledTimes(1);
      expect(validator).toBeCalledTimes(1);

      expect(next).toBeCalledTimes(0);
    });

    it('with payload, decodes, validates, invokes next with context', async (): Promise<void> => {
      const decoder = fn<HttpBodyDecoder<Grok.Constraint.Anything>>();
      const validator = fn<HttpValidatorFunction<Grok.Constraint.Anything, unknown>>();

      decoder.mockImplementationOnce((value: string): unknown => {
        expect(value).toStrictEqual('value:provider:payload:body:valid');

        return 'test-action:decoder:success';
      });

      validator.mockImplementationOnce((value: unknown): HttpValidatorFunctionResultSuccess<unknown> => {
        expect(value).toStrictEqual('test-action:decoder:success');

        return {
          success: true,
          data: 'test-action:validator:success',
        };
      });

      const middleware = HttpRequestBodyValidatorMiddleware.create(decoder, validator);

      const next = jest.fn();

      next.mockImplementationOnce(async (context: HttpRequestBodyValidatorContext<unknown>): Promise<HandlerResponseConstraint> => {
        expect(context.body).toStrictEqual('test-action:validator:success');

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
              body: 'value:provider:payload:body:valid',
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HandlerResponseConstraint>({
        type: 'response:example',
        value: 'test-action:middleware:next:success',
      });

      expect(decoder).toBeCalledTimes(1);
      expect(validator).toBeCalledTimes(1);

      expect(next).toBeCalledTimes(1);
    });
  });

  describe('zod()', (): void => {
    it('with body, json malformed, returns error', async (): Promise<void> => {
      type TestBodyMapping = {
        name: string;
        age: number;
      };

      const middleware = HttpRequestBodyValidatorMiddleware.zod<TestBodyMapping>(
        z.object<FromType<TestBodyMapping>>({
          name: z.string(),
          age: z.number(),
        }),
      );

      const next = jest.fn();

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: '{b"r[o]ke"n}}',
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestBodyValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: undefined,
        },
      });

      expect(next).toBeCalledTimes(0);
    });

    it('with body, json deocded, zod schema invalid, returns error', async (): Promise<void> => {
      type TestBodyMapping = {
        name: string;
        age: number;
      };

      const middleware = HttpRequestBodyValidatorMiddleware.zod<TestBodyMapping>(
        z.object<FromType<TestBodyMapping>>({
          name: z.string(),
          age: z.number(),
        }),
      );

      const next = jest.fn();

      expect(
        await middleware.invoke({
          provider: {
            id: 'provider:aws',

            payload: partial<Event.Payload<'apigw:proxy:v2'>>({
              body: JSON.stringify({}),
            }),
          },

          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpRequestBodyValidatorErrorResponse>({
        type: 'response:http',

        value: {
          status: 400,
          body: [
            expect.objectContaining<Partial<ZodIssue>>({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['name'],
            }),
            expect.objectContaining<Partial<ZodIssue>>({
              code: 'invalid_type',
              message: 'Required',
              received: 'undefined',
              path: ['age'],
            }),
          ],
        },
      });

      expect(next).toBeCalledTimes(0);
    });

    it('with body, json deocded, zod schema validates, invokes next with context', async (): Promise<void> => {
      type TestBodyMapping = {
        name: string;
        age: number;
      };

      const middleware = HttpRequestBodyValidatorMiddleware.zod<TestBodyMapping>(
        z.object<FromType<TestBodyMapping>>({
          name: z.string(),
          age: z.number(),
        }),
      );

      const next = jest.fn();

      next.mockImplementationOnce(async (context: HttpRequestBodyValidatorContext<unknown>): Promise<HandlerResponseConstraint> => {
        expect(context.body).toStrictEqual<TestBodyMapping>({
          name: 'some-name',
          age: 40,
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
              body: JSON.stringify({
                name: 'some-name',
                age: 40,
              }),
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
