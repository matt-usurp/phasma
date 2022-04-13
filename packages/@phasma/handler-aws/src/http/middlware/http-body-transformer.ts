import type { Grok } from '@matt-usurp/grok';
import type { Middleware } from '@phasma/handler-aws/src/index';
import { HttpBodyTransformer } from '@phasma/handler/src/http/body';
import { ensure } from '@phasma/handler/src/http/header';
import { http, HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';
import { unwrap } from '@phasma/handler/src/response';
import type { HttpEncodedTransport } from './http-transformer';

export type HttpBodyObjectTransport = HttpResponseTransport<number, Grok.Constraint.Anything>;

export type HttpTransformerMiddlewareDefinition<R extends HttpBodyObjectTransport> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Middleware.Definition.SomeProvider,
    Middleware.Definition.SomeContextInbound,
    Middleware.Definition.SomeContextOutbound,
    HttpResponse<R>,
    HttpResponse<HttpEncodedTransport>
  >
/* eslint-enable @typescript-eslint/indent */
);

export class HttpBodyTransformerMiddleware<R extends HttpBodyObjectTransport> implements Middleware.Implementation<HttpTransformerMiddlewareDefinition<R>> {
  public constructor(
    public readonly encoder: HttpBodyTransformer,
  ) {}

  public async invoke({ context, next }: Middleware.Fn.Parameters<HttpTransformerMiddlewareDefinition<R>>): Middleware.Fn.Response<HttpTransformerMiddlewareDefinition<R>> {
    const value = await next(context);

    if (value.type === 'response:http') {
      const transport = unwrap(value);
      const encoded = this.encoder(transport.body);

      return http<HttpEncodedTransport>({
        status: transport.status,

        headers: {
          ...ensure(transport.headers),

          'content-type': 'application/json',
          'content-length': encoded.value.length,
        },

        body: encoded.value,
      });
    }

    return value;
  }
}
