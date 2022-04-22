import type { HandlerResponse } from '@phasma/handler/src/component/response';
import { encode as json } from '@phasma/handler/src/http/body/json';
import { http, HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';
import { HttpBodyObjectTransport, HttpResponseBodyEncoderMiddleware } from './http-response-body-encoder';

type TestJsonResponseTransport = {
  song: string;
  artist: string;
};

describe(HttpResponseBodyEncoderMiddleware.name, (): void => {
  describe('create()', (): void => {
    it('using json transformer, given object, return json encoded http response', async (): Promise<void> => {
      const middleware = HttpResponseBodyEncoderMiddleware.create(json);

      const next = jest.fn();

      next.mockImplementationOnce(async (): Promise<HttpResponse<HttpResponseTransport<200, TestJsonResponseTransport>>> => {
        return http({
          status: 200,
          body: {
            song: '1985',
            artist: 'Bowling For Soup',
          },
        });
      });

      expect(
        await middleware.invoke({
          // Provider is ignore for this middleware
          provider: 'given-provider',

          // Context is ignored for this middleware
          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HttpResponse<HttpBodyObjectTransport>>({
        type: 'response:http',
        value: {
          status: 200,

          headers: {
            'content-type': 'application/json',
            'content-length': 43,
          },

          body: JSON.stringify({
            song: '1985',
            artist: 'Bowling For Soup',
          }),
        },
      });

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith('given-context');
    });

    it('with unknown response, returns unknown response', async (): Promise<void> => {
      const middleware = HttpResponseBodyEncoderMiddleware.create(json);

      const next = jest.fn();

      next.mockImplementationOnce(async (): Promise<HandlerResponse<'response:unknown', 1000>> => {
        return {
          type: 'response:unknown',
          value: 1000,
        };
      });

      expect(
        await middleware.invoke({
          // Provider is ignore for this middleware
          provider: 'given-provider',

          // Context is ignored for this middleware
          context: 'given-context' as any, // eslint-disable-line @typescript-eslint/no-explicit-any
          next,
        }),
      ).toStrictEqual<HandlerResponse<'response:unknown', 1000>>({
        type: 'response:unknown',
        value: 1000,
      });

      expect(next).toBeCalledTimes(1);
      expect(next).toBeCalledWith('given-context');
    });
  });

  describe('json()', (): void => {
    it('using static factory, json, returns middleware with json encoding', (): void => {
      const middleware = HttpResponseBodyEncoderMiddleware.json();

      expect(middleware.encoder).toStrictEqual(json);
    });
  });
});
