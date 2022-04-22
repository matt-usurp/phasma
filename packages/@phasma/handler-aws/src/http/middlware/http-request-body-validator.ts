import { Grok } from '@matt-usurp/grok';
import type { HttpBodyDecoder } from '@phasma/handler/src/http/body';
import { decode as json } from '@phasma/handler/src/http/body/json';
import { http, HttpResponse, HttpResponseTransport, HttpResponseTransportKind } from '@phasma/handler/src/http/response';
import { HttpValidatorFunction } from '@phasma/handler/src/http/validator';
import { validate, ZodSchema } from '@phasma/handler/src/http/validator/zod';
import type { Middleware, Provider } from '../../index';

export type HttpRequestBodyValidatorErrorResponse = HttpResponse<HttpResponseTransport<400, unknown>>;

export type HttpRequestBodyValidatorContext<T> = {
  readonly body: T;
};

export type HttpRequestBodyValidatorMiddlewareDefinition<T> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Provider.WithEventSource<'apigw:proxy:v2'>,
    Middleware.Definition.SomeContextInbound,
    HttpRequestBodyValidatorContext<T>,
    Middleware.Definition.SomeResponseInbound,
    HttpResponse<HttpResponseTransportKind>
  >
/* eslint-enable @typescript-eslint/indent */
);

export class HttpRequestBodyValidatorMiddleware<T> implements Middleware.Implementation<HttpRequestBodyValidatorMiddlewareDefinition<T>> {
  public static zod<T>(schema: ZodSchema): HttpRequestBodyValidatorMiddleware<T> {
    return new HttpRequestBodyValidatorMiddleware(json, validate(schema));
  }

  public static create<T>(
    decoder: HttpBodyDecoder<Grok.Constraint.ObjectLike>,
    validator: HttpValidatorFunction<Grok.Constraint.ObjectLike, unknown>,
  ): HttpRequestBodyValidatorMiddleware<T> {
    return new HttpRequestBodyValidatorMiddleware(decoder, validator);
  }

  protected constructor(
    public readonly decoder: HttpBodyDecoder<Grok.Constraint.ObjectLike>,
    public readonly validator: HttpValidatorFunction<Grok.Constraint.ObjectLike, unknown>,
  ) {}

  public async invoke({ provider, context, next }: Middleware.Fn.Parameters<HttpRequestBodyValidatorMiddlewareDefinition<T>>): Middleware.Fn.Response<HttpRequestBodyValidatorMiddlewareDefinition<T>> {
    const body = provider.payload?.body;

    if (body === undefined || body === '') {
      return http({
        status: 400,
        body: undefined,
      });
    }

    const payload = this.decoder(body);

    if (payload === undefined) {
      return http({
        status: 400,
        body: undefined,
      });
    }

    const result = this.validator(payload);

    if (result.success === false) {
      return http({
        status: 400,
        body: result.errors,
      });
    }

    return next({
      ...context,

      body: result.data as unknown as T,
    });
  }
}
