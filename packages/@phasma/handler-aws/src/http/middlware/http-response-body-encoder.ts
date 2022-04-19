import type { Grok } from '@matt-usurp/grok';
import { HttpBodyEncoder, json } from '@phasma/handler/src/http/body';
import { ensure } from '@phasma/handler/src/http/header';
import { http, HttpResponse, HttpResponseEncodedTransport, HttpResponseTransport } from '@phasma/handler/src/http/response';
import { unwrap } from '@phasma/handler/src/response';
import type { Middleware } from '../../index';

export type HttpBodyObjectTransport = HttpResponseTransport<number, Grok.Constraint.Anything>;

export type HttpTransformerMiddlewareDefinition<R extends HttpBodyObjectTransport> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Middleware.Definition.SomeProvider,
    Middleware.Definition.SomeContextInbound,
    Middleware.Definition.SomeContextOutbound,
    HttpResponse<R>,
    HttpResponse<HttpResponseEncodedTransport>
  >
/* eslint-enable @typescript-eslint/indent */
);

export class HttpResponseBodyEncoderMiddleware<R extends HttpBodyObjectTransport> implements Middleware.Implementation<HttpTransformerMiddlewareDefinition<R>> {
  /**
   * Create a HTTP body transformer with the JSON encoding.
   */
  public static json<R extends HttpBodyObjectTransport>(): HttpResponseBodyEncoderMiddleware<R> {
    return new HttpResponseBodyEncoderMiddleware(json);
  }

  public constructor(
    public readonly encoder: HttpBodyEncoder,
  ) {}

  public async invoke({ context, next }: Middleware.Fn.Parameters<HttpTransformerMiddlewareDefinition<R>>): Middleware.Fn.Response<HttpTransformerMiddlewareDefinition<R>> {
    const value = await next(context);

    if (value.type === 'response:http') {
      const transport = unwrap(value);
      const encoded = this.encoder(transport.body);

      return http<HttpResponseEncodedTransport>({
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
