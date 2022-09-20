import type { HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';
import type { Event, Middleware, Response } from '../../index';
import { result } from '../../response';

export type HttpResponseLambdaProxy = Event.Response<'apigw:proxy:v2'>;

export type HttpResponseEncodedTransport = HttpResponseTransport<number, string>;

export type HttpResponseTransformerMiddlewareDefinition<R extends HttpResponseEncodedTransport> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Middleware.Definition.Any.Provider,
    Middleware.Definition.Any.ContextInbound,
    Middleware.Definition.Any.ContextOutbound,
    HttpResponse<R>,
    HttpResponseLambdaProxy
  >
/* eslint-enable @typescript-eslint/indent */
);

export class HttpResponseTransformerMiddleware<R extends HttpResponseEncodedTransport> implements Middleware.Implementation<HttpResponseTransformerMiddlewareDefinition<R>> {
  public static create<R extends HttpResponseEncodedTransport>(): HttpResponseTransformerMiddleware<R> {
    return new HttpResponseTransformerMiddleware();
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  protected constructor() {}

  public async invoke({ context, next }: Middleware.Fn.Input<HttpResponseTransformerMiddlewareDefinition<R>>): Middleware.Fn.Output<HttpResponseTransformerMiddlewareDefinition<R>> {
    const value = await next(context);

    if (value.type === 'response:http') {
      return result<Response.Get.Value<HttpResponseLambdaProxy>>({
        statusCode: value.value.status,
        headers: value.value.headers ?? {},
        body: value.value.body,
      });
    }

    return value;
  }
}
