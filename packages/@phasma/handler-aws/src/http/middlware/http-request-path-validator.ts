import type { Grok } from '@matt-usurp/grok';
import { http, HttpResponse, HttpResponseTransport, HttpResponseTransportKind } from '@phasma/handler/src/http/response';
import type { HttpValidatorFunction } from '@phasma/handler/src/http/validator';
import { validate, ZodSchema } from '@phasma/handler/src/http/validator/zod';
import type { Middleware, Provider } from '../../index';

export type HttpRequestPathValidatorErrorResponse = HttpResponse<HttpResponseTransport<400, unknown>>;

export type HttpRequestPathValidatorContext<T> = {
  readonly path: T;
};

export type HttpRequestPathValidatorMiddlewareDefinition<T> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Provider.WithEventSource<'apigw:proxy:v2'>,
    Middleware.Definition.Inherit.ContextInbound,
    HttpRequestPathValidatorContext<T>,
    Middleware.Definition.Inherit.ResponseInbound,
    HttpResponse<HttpResponseTransportKind>
  >
/* eslint-enable @typescript-eslint/indent */
);

export class HttpRequestPathValidatorMiddleware<T extends Grok.Constraint.ObjectLike> implements Middleware.Implementation<HttpRequestPathValidatorMiddlewareDefinition<T>> {
  public static zod<T extends Grok.Constraint.ObjectLike>(schema: ZodSchema): HttpRequestPathValidatorMiddleware<T> {
    return new HttpRequestPathValidatorMiddleware<T>(validate(schema));
  }

  public static create<T extends Grok.Constraint.ObjectLike>(validator: HttpValidatorFunction<Grok.Constraint.ObjectLike, unknown>): HttpRequestPathValidatorMiddleware<T> {
    return new HttpRequestPathValidatorMiddleware(validator);
  }

  protected constructor(
    public readonly validator: HttpValidatorFunction<Grok.Constraint.ObjectLike, unknown>,
  ) {}

  public async invoke({ provider, context, next }: Middleware.Fn.Parameters<HttpRequestPathValidatorMiddlewareDefinition<T>>): Middleware.Fn.Response<HttpRequestPathValidatorMiddlewareDefinition<T>> {
    const path = provider.event?.pathParameters;

    if (path === undefined) {
      return http({
        status: 400,
        body: undefined,
      });
    }

    const result = this.validator(path);

    if (result.success === false) {
      return http({
        status: 400,
        body: result.errors,
      });
    }

    return next({
      ...context,

      path: result.data as unknown as T,
    });
  }
}
