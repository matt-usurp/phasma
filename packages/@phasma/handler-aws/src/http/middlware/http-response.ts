import type { HttpBodyEncoder } from '@phasma/handler/src/http/body';
import { encode as json } from '@phasma/handler/src/http/body/json';
import { ensure } from '@phasma/handler/src/http/header';
import { unwrap } from '@phasma/handler/src/response';
import type { Event, Http, Middleware } from '../../index';
import { result } from '../../response';

export type WithHttpResponseErrorPayload = {
  readonly origin: string;
  readonly errors: unknown;
};

/**
 * A {@link WithHttpResponse} type definition.
 */
export type WithHttpResponseDefinition<Transport extends Http.Response.AnyTransport> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Middleware.Definition.Any.Provider,
    Middleware.Definition.Any.ContextInbound,
    Middleware.Definition.Any.ContextOutbound,
    Http.Response<Transport> | Http.Response.AnyError,
    Event.Response<'apigw:proxy:v2'>
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * A http response tranformer middleware that transforms {@link Http.Response} into the expected format for use with Lambda and API Gateway V2.
 *
 * This allows inbound responses of type {@link Http.Response} with the provided {@link Trasnport} type.
 * This allows inbound responses of type {@link Http.Response.Error}.
 * This outputs API Gateway V2 compatible responses for use with the provider.
 */
export class WithHttpResponse<Transport extends Http.Response.AnyTransport> implements Middleware.Implementation<WithHttpResponseDefinition<Transport>> {
  /**
   * Create an instance of {@link WithHttpResponse} supporting the response {@link Transport}.
   * All response bodies will be encoded using the {@link encoder} provided before returning to the provider.
   */
  public constructor(
    public readonly encoder: HttpBodyEncoder,
  ) {}

  /**
   * @inheritdoc
   */
  public async invoke({ context, next }: Middleware.Fn.Input<WithHttpResponseDefinition<Transport>>): Middleware.Fn.Output<WithHttpResponseDefinition<Transport>> {
    const value = await next(context);

    if (value.type === 'response:http') {
      const transport = unwrap(value);
      const encoded = this.encoder(transport.body);

      return result<Event.ResponseValue<'apigw:proxy:v2'>>({
        statusCode: transport.status,

        headers: {
          ...ensure(transport.headers),

          'content-type': encoded.mime,
          'content-length': encoded.value.length.toString(),
        },

        body: encoded.value,
      });
    }

    if (value.type ==='response:http-error') {
      const transport = unwrap(value);

      const payload: WithHttpResponseErrorPayload = {
        origin: transport.origin,
        errors: transport.errors,
      };

      const encoded = this.encoder(payload);

      return result<Event.ResponseValue<'apigw:proxy:v2'>>({
        statusCode: 400,

        headers: {
          'error-origin': transport.origin,
          'error-hint': transport.hint,

          'content-type': encoded.mime,
          'content-length': encoded.value.length.toString(),
        },

        body: encoded.value,
      });
    }

    return value;
  }
}

/**
 * A {@link WithHttpResponse} that uses JSON encoding to encode response bodies.
 *
 * This provides the `Content-Type` header as `application/json` automatically.
 * This provides the `Content-Length` header automatically.
 */
export class WithHttpResponseUsingJsonEncoding<Transport extends Http.Response.AnyTransport> extends WithHttpResponse<Transport> {
  /**
   * Create an instance of {@link WithHttpResponseUsingJsonEncoding}.
   */
  public constructor () {
    super(json);
  }
}
