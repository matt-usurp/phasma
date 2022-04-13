import type { Middleware } from '@phasma/handler/src';
import type { HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';
import type { Event, Response } from '../../index';
import { result } from '../../response';

export type HttpResponseLambdaProxy = Event.ResultRaw<'apigw:proxy:v2'>;

export type HttpEncodedTransport = HttpResponseTransport<number, string>;

export type HttpTransformerMiddlewareDefinition<R extends HttpEncodedTransport> = (
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

export class HttpTransformerMiddleware<R extends HttpEncodedTransport> implements Middleware.Implementation<HttpTransformerMiddlewareDefinition<R>> {
  public async invoke({ context, next }: Middleware.Fn.Parameters<HttpTransformerMiddlewareDefinition<R>>): Middleware.Fn.Response<HttpTransformerMiddlewareDefinition<R>> {
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
