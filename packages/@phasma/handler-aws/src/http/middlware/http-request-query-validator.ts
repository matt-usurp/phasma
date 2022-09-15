import type { Grok } from '@matt-usurp/grok';
import type { HttpQueryParser } from '@phasma/handler/src/http/query';
import { parse as query } from '@phasma/handler/src/http/query';
import { http, HttpResponse, HttpResponseTransport, HttpResponseTransportKind } from '@phasma/handler/src/http/response';
import type { HttpValidatorFunction } from '@phasma/handler/src/http/validator';
import { validate, ZodSchema } from '@phasma/handler/src/http/validator/zod';
import type { Middleware, Provider } from '../../index';

export type HttpRequestQueryValidatorErrorResponse = HttpResponse<HttpResponseTransport<400, unknown>>;

export type HttpRequestQueryValidatorContext<T> = {
  readonly query: T;
};

export type HttpRequesQueryValidatorMiddlewareDefinition<T> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Provider.WithEventSource<'apigw:proxy:v2'>,
    Middleware.Definition.Inherit.ContextInbound,
    HttpRequestQueryValidatorContext<T>,
    Middleware.Definition.Inherit.ResponseInbound,
    HttpResponse<HttpResponseTransportKind>
  >
/* eslint-enable @typescript-eslint/indent */
);

export class HttpRequesQueryValidatorMiddleware<T extends Grok.Constraint.ObjectLike> implements Middleware.Implementation<HttpRequesQueryValidatorMiddlewareDefinition<T>> {
  public static zod<T extends Grok.Constraint.ObjectLike>(schema: ZodSchema): HttpRequesQueryValidatorMiddleware<T> {
    return new HttpRequesQueryValidatorMiddleware(query, validate(schema));
  }

  public static create<T extends Grok.Constraint.ObjectLike>(
    parser: HttpQueryParser<Grok.Constraint.ObjectLike>,
    validator: HttpValidatorFunction<Grok.Constraint.ObjectLike, unknown>,
  ): HttpRequesQueryValidatorMiddleware<T> {
    return new HttpRequesQueryValidatorMiddleware(parser, validator);
  }

  protected constructor(
    public readonly parser: HttpQueryParser<Grok.Constraint.ObjectLike>,
    public readonly validator: HttpValidatorFunction<Grok.Constraint.ObjectLike, unknown>,
  ) {}

  public async invoke({ provider, context, next }: Middleware.Fn.Parameters<HttpRequesQueryValidatorMiddlewareDefinition<T>>): Middleware.Fn.Response<HttpRequesQueryValidatorMiddlewareDefinition<T>> {
    const query = provider.event?.rawQueryString ?? '';
    const parsed = this.parser(query);

    if (parsed === undefined) {
      return http({
        status: 400,
        body: undefined,
      });
    }

    const result = this.validator(parsed);

    if (result.success === false) {
      return http({
        status: 400,
        body: result.errors,
      });
    }

    return next({
      ...context,

      query: result.data as unknown as T,
    });
  }
}
