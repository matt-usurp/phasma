import { fn } from '@matt-usurp/grok/testing';
import type { HandlerResponse, HandlerResponseIdentifier } from '@phasma/handler/src/component/response';
import type { HttpBodyEncoder, HttpBodyEncoderResult } from '@phasma/handler/src/http/body';
import { error, http, HttpResponse, HttpResponseError, HttpResponseTransport } from '@phasma/handler/src/http/response';
import type { Event } from '../../index';
import { result } from '../../response';
import { HttpResponseTransformerErrorPayload, HttpResponseTransformerMiddleware, HttpResponseTransformerMiddlewareUsingJsonEncoding } from './http-response-transformer';

describe(HttpResponseTransformerMiddleware.name, (): void => {
  describe('constructor()', (): void => {
    it('with next, returns http response, encoder called, with value, composes lambda response', async (): Promise<void> => {
      type TestHttpResponse = HttpResponse<HttpResponseTransport<201, 'test:response:value'>>;

      const encoder = fn<HttpBodyEncoder>();

      encoder.mockImplementationOnce((): HttpBodyEncoderResult => {
        return {
          mime: 'test:encoder:mime',
          value: 'test:encoder:response',
        };
      });

      const middleware = new HttpResponseTransformerMiddleware(encoder);

      const next = vi.fn();

      next.mockImplementationOnce(async (): Promise<TestHttpResponse> => {
        return http<TestHttpResponse>({
          status: 201,
          body: 'test:response:value',
        });
      });

      expect(
        await middleware.invoke({
          provider: 'test:middleware:provider' as never,
          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<Event.Response<'apigw:proxy:v2'>>(
        result({
          statusCode: 201,

          headers: {
            'content-type': 'test:encoder:mime',
            'content-length': '21',
          },

          body: 'test:encoder:response',
        }),
      );

      expect(encoder).toBeCalledTimes(1);
      expect(encoder).toBeCalledWith<[string]>('test:response:value');

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith<[string]>('test:middleware:context');
    });

    it('with next, returns http error response, encoder called, with value, composes lambda response', async (): Promise<void> => {
      type TestHttpError = HttpResponseError<'test:error:origin', 'test:error:hint', 'test:error:value'>;

      const encoder = fn<HttpBodyEncoder>();

      encoder.mockImplementationOnce((): HttpBodyEncoderResult => {
        return {
          mime: 'test:encoder:mime',
          value: 'test:encoder:response',
        };
      });

      const middleware = new HttpResponseTransformerMiddleware(encoder);

      const next = vi.fn();

      next.mockImplementationOnce(async (): Promise<TestHttpError> => {
        return error<TestHttpError>(
          'test:error:origin',
          'test:error:hint',
          'test:error:value',
        );
      });

      expect(
        await middleware.invoke({
          provider: 'test:middleware:provider' as never,
          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<Event.Response<'apigw:proxy:v2'>>(
        result({
          statusCode: 400,

          headers: {
            'error-origin': 'test:error:origin',
            'error-hint': 'test:error:hint',

            'content-type': 'test:encoder:mime',
            'content-length': '21',
          },

          body: 'test:encoder:response',
        }),
      );

      expect(encoder).toBeCalledTimes(1);
      expect(encoder).toBeCalledWith<[HttpResponseTransformerErrorPayload]>({
        origin: 'test:error:origin',
        errors: 'test:error:value',
      });

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith<[string]>('test:middleware:context');
    });

    it('with next, returns unknown response, encoder not called, response passes through', async (): Promise<void> => {
      type TestUnknownResponse = HandlerResponse<HandlerResponseIdentifier<'unknown'>, 'test:response:unknown:value'>;

      const encoder = fn<HttpBodyEncoder>();

      const middleware = new HttpResponseTransformerMiddleware(encoder);

      const next = vi.fn();

      next.mockImplementationOnce(async (): Promise<TestUnknownResponse> => {
        return {
          type: 'response:unknown',
          value: 'test:response:unknown:value',
        };
      });

      expect(
        await middleware.invoke({
          provider: 'test:middleware:provider' as never,
          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<TestUnknownResponse>({
        type: 'response:unknown',
        value: 'test:response:unknown:value',
      });

      expect(encoder).toBeCalledTimes(0);

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith<[string]>('test:middleware:context');
    });
  });
});

describe(HttpResponseTransformerMiddlewareUsingJsonEncoding.name, (): void => {
  describe('constructor()', (): void => {
    it('with next, returns http response, encoder called, with value, composes lambda response', async (): Promise<void> => {
      type TestHttpResponse = HttpResponse<HttpResponseTransport<202, { a: string; b: string }>>;

      const middleware = new HttpResponseTransformerMiddlewareUsingJsonEncoding();

      const next = vi.fn();

      next.mockImplementationOnce(async (): Promise<TestHttpResponse> => {
        return http<TestHttpResponse>({
          status: 202,

          body: {
            a: 'test:response:value:a',
            b: 'test:response:value:b',
          },
        });
      });

      expect(
        await middleware.invoke({
          provider: 'test:middleware:provider' as never,
          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<Event.Response<'apigw:proxy:v2'>>(
        result({
          statusCode: 202,

          headers: {
            'content-type': 'application/json',
            'content-length': '57',
          },

          body: '{"a":"test:response:value:a","b":"test:response:value:b"}',
        }),
      );

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith<[string]>('test:middleware:context');
    });

    it('with next, returns http error response, encoder called, with value, composes lambda response', async (): Promise<void> => {
      type TestHttpError = HttpResponseError<'test:error:origin', 'test:error:hint', 'test:error:value'>;

      const middleware = new HttpResponseTransformerMiddlewareUsingJsonEncoding();

      const next = vi.fn();

      next.mockImplementationOnce(async (): Promise<TestHttpError> => {
        return error<TestHttpError>(
          'test:error:origin',
          'test:error:hint',
          'test:error:value',
        );
      });

      expect(
        await middleware.invoke({
          provider: 'test:middleware:provider' as never,
          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<Event.Response<'apigw:proxy:v2'>>(
        result({
          statusCode: 400,

          headers: {
            'error-origin': 'test:error:origin',
            'error-hint': 'test:error:hint',

            'content-type': 'application/json',
            'content-length': '58',
          },

          body: '{"origin":"test:error:origin","errors":"test:error:value"}',
        }),
      );

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith<[string]>('test:middleware:context');
    });

    it('with next, returns unknown response, encoder not called, response passes through', async (): Promise<void> => {
      type TestUnknownResponse = HandlerResponse<HandlerResponseIdentifier<'unknown'>, 'test:response:unknown:value'>;

      const middleware = new HttpResponseTransformerMiddlewareUsingJsonEncoding();

      const next = vi.fn();

      next.mockImplementationOnce(async (): Promise<TestUnknownResponse> => {
        return {
          type: 'response:unknown',
          value: 'test:response:unknown:value',
        };
      });

      expect(
        await middleware.invoke({
          provider: 'test:middleware:provider' as never,
          context: 'test:middleware:context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<TestUnknownResponse>({
        type: 'response:unknown',
        value: 'test:response:unknown:value',
      });

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith<[string]>('test:middleware:context');
    });
  });
});
