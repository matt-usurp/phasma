import { HandlerMiddlewareDefinition, HandlerMiddlewareFunctionParameters, HandlerMiddlewareFunctionResponse, HandlerMiddlewareImplementationWithInvokeFunction } from '@phasma/handler/src/component/middleware';
import { HttpBodyTransformerEncoder } from '@phasma/handler/src/http/body';
import { http, HttpResponse, HttpResponseTransport, HttpResponseTransportKind } from '@phasma/handler/src/http/response';
import { unwrap } from '@phasma/handler/src/response';
import { HttpEncodedTransport } from './http-transformer';

export type HttpBodyObjectTransport = HttpResponseTransport<number, any>;

export type HttpTransformerMiddlewareDefinition<R extends HttpResponseTransportKind> = (
  HandlerMiddlewareDefinition<
    HandlerMiddlewareDefinition.SomeProvider,
    HandlerMiddlewareDefinition.SomeContextInbound,
    HandlerMiddlewareDefinition.SomeContextOutbound,
    HttpResponse<R>,
    HttpResponse<HttpEncodedTransport>
  >
);

export class HttpBodyTransformerMiddleware<R extends HttpBodyObjectTransport> implements HandlerMiddlewareImplementationWithInvokeFunction<HttpTransformerMiddlewareDefinition<R>> {
  public constructor(
    public readonly encoder: HttpBodyTransformerEncoder
  ) {}

  public async invoke({ context, next }: HandlerMiddlewareFunctionParameters<HttpTransformerMiddlewareDefinition<R>>): Promise<HandlerMiddlewareFunctionResponse<HttpTransformerMiddlewareDefinition<R>>> {
    const result = await next(context);

    if (result.type === 'response:http') {
      const value = unwrap(result);

      return http<HttpEncodedTransport>({
        status: value.status,
        headers: value.headers,
        body: this.encoder(value.body),
      });
    }

    return result;
  }
}
