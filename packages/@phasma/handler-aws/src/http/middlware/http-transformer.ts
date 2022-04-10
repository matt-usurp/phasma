import type { Middleware } from '@phasma/handler/src';
import type { HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';
import { create } from '@phasma/handler/src/response';
import type { LambdaHandlerEventSourceFromIdentifier } from '../../component/event';

export type HttpResponseLambdaProxy = LambdaHandlerEventSourceFromIdentifier<'apigw:proxy:v2'>['EventSourceResponse'];

export type HttpEncodedTransport = HttpResponseTransport<number, string>;

export type HttpTransformerMiddlewareDefinition<R extends HttpEncodedTransport> = (
  Middleware.Definition<
    Middleware.Definition.SomeProvider,
    Middleware.Definition.SomeContextInbound,
    Middleware.Definition.SomeContextOutbound,
    HttpResponse<R>,
    HttpResponseLambdaProxy
  >
);

export class HttpTransformerMiddleware<R extends HttpEncodedTransport> implements Middleware.Implementation<HttpTransformerMiddlewareDefinition<R>> {
  public async invoke({ context, next }: Middleware.Fn.Parameters<HttpTransformerMiddlewareDefinition<R>>): Middleware.Fn.Response<HttpTransformerMiddlewareDefinition<R>> {
    const result = await next(context);

    if (result.type === 'response:http') {
      return create<HttpResponseLambdaProxy>('response:aws:result', {
        statusCode: result.value.status,
        headers: result.value.headers ?? {},
        body: result.value.body,
      });
    }

    return result;
  }
}
