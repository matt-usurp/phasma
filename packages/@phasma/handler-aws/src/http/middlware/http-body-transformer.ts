import { HandlerMiddlewareDefinition, HandlerMiddlewareFunctionParameters, HandlerMiddlewareFunctionResponse, HandlerMiddlewareImplementationWithInvokeFunction } from '@phasma/handler/src/component/middleware';
import { HttpBodyTransformer } from '@phasma/handler/src/http/body';
import { ensure } from '@phasma/handler/src/http/header';
import { http, HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';
import { unwrap } from '@phasma/handler/src/response';
import { HttpEncodedTransport } from './http-transformer';

export type HttpBodyObjectTransport = HttpResponseTransport<number, any>;

export type HttpTransformerMiddlewareDefinition<R extends HttpBodyObjectTransport> = (
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
    public readonly encoder: HttpBodyTransformer
  ) {}

  public async invoke({ context, next }: HandlerMiddlewareFunctionParameters<HttpTransformerMiddlewareDefinition<R>>): Promise<HandlerMiddlewareFunctionResponse<HttpTransformerMiddlewareDefinition<R>>> {
    const result = await next(context);

    if (result.type === 'response:http') {
      const value = unwrap(result);
      const encoded = this.encoder(value.body);

      return http<HttpEncodedTransport>({
        status: value.status,

        headers: {
          ...ensure(value.headers),

          'content-type': 'application/json',
          'content-length': encoded.value.length,
        },

        body: encoded.value,
      });
    }

    return result;
  }
}
