import type { HandlerResponse } from '@phasma/handler/src/component/response';
import { http, HttpResponse } from '@phasma/handler/src/http/response';
import { HttpResponseLambdaProxy, HttpResponseTransformerMiddleware } from './http-response-transformer';

describe(HttpResponseTransformerMiddleware.name, (): void => {
  it('with http response, returns lambda response response', async (): Promise<void> => {
    const middleware = new HttpResponseTransformerMiddleware();

    const next = jest.fn();

    next.mockImplementationOnce(async (): Promise<HttpResponse> => {
      return http({
        status: 204,
        body: undefined,
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
    ).toStrictEqual<HttpResponseLambdaProxy>({
      type: 'response:aws:result',
      value: {
        statusCode: 204,
        headers: {},
        body: undefined,
      },
    });

    expect(next).toBeCalledTimes(1);
    expect(next).toBeCalledWith('given-context');
  });

  it('with unknown response, returns unknown response', async (): Promise<void> => {
    const middleware = new HttpResponseTransformerMiddleware();

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
