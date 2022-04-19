import type { HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';
import type { Middleware } from '@phasma/handler/src/index';
import type { Event, Response } from '../../index';
import { result } from '../../response';

export type HttpResponseLambdaProxy = Event.ResultRaw<'apigw:proxy:v2'>;

export type HttpResponseEncodedTransport = HttpResponseTransport<number, string>;

export type HttpResponseTransformerMiddlewareDefinition<R extends HttpResponseEncodedTransport> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Middleware.Definition.SomeProvider,
    Middleware.Definition.SomeContextInbound,
    Middleware.Definition.SomeContextOutbound,
    HttpResponse<R>,
    HttpResponseLambdaProxy
  >
/* eslint-enable @typescript-eslint/indent */
);

export class HttpResponseTransformerMiddleware<R extends HttpResponseEncodedTransport> implements Middleware.Implementation<HttpResponseTransformerMiddlewareDefinition<R>> {
  public async invoke({ context, next }: Middleware.Fn.Parameters<HttpResponseTransformerMiddlewareDefinition<R>>): Middleware.Fn.Response<HttpResponseTransformerMiddlewareDefinition<R>> {
    const value = await next(context);

    if (value.type === 'response:http') {
      return result<Response.Unwrapped<HttpResponseLambdaProxy>>({
        statusCode: value.value.status,
        headers: value.value.headers ?? {},
        body: value.value.body,
      });
    }

    return value;
  }
}
