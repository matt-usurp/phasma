import type { Grok } from '@matt-usurp/grok';
import type { HttpQueryParser } from '@phasma/handler/src/http/query';
import { parse as query } from '@phasma/handler/src/http/query';
import { error } from '@phasma/handler/src/http/response';
import type { HttpValidatorFunction } from '@phasma/handler/src/http/validator';
import { validate } from '@phasma/handler/src/http/validator/zod';
import type { ZodIssue, ZodSchema } from 'zod';
import type { Http, Middleware, Provider } from '../../index';

export type HttpRequestQueryValidatorResponseError<Error> = (
  | HttpRequestQueryValidatorResponseError.QueryStringMalformed
  | HttpRequestQueryValidatorResponseError.QueryValidationFailure<Error>
);

export namespace HttpRequestQueryValidatorResponseError {
  export type QueryStringMalformed = Http.Response.Error<'query', 'malformed', undefined>;
  export type QueryValidationFailure<Error> = Http.Response.Error<'query', 'validation', Error>;
}

export type HttpRequestQueryValidatorContext<Query> = {
  /**
   * Query parameters parsed and made available via {@link HttpRequestQueryValidatorMiddleware}.
   */
  readonly query: Query;
};

/**
 * A {@link HttpRequestQueryValidatorMiddleware} type definition.
 */
export type HttpRequestQueryValidatorMiddlewareDefinition<Query extends Grok.Constraint.ObjectLike, ValidationError> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Provider.ForEvent<'apigw:proxy:v2'>,
    Middleware.Definition.Any.ContextInbound,
    HttpRequestQueryValidatorContext<Query>,
    Middleware.Definition.Any.ResponseInbound,
    HttpRequestQueryValidatorResponseError<ValidationError>
  >
/* eslint-enable @typescript-eslint/indent */
);

export class HttpRequestQueryValidatorMiddleware<Query extends Grok.Constraint.ObjectLike, ValidationError> implements Middleware.Implementation<HttpRequestQueryValidatorMiddlewareDefinition<Query, ValidationError>> {
  public constructor(
    public readonly parser: HttpQueryParser<Grok.Constraint.ObjectLike>,
    public readonly validator: HttpValidatorFunction<Grok.Constraint.ObjectLike, ValidationError>,
  ) {}

  /**
   * @inheritdoc
   */
  public async invoke({ provider, context, next }: Middleware.Fn.Input<HttpRequestQueryValidatorMiddlewareDefinition<Query, ValidationError>>): Middleware.Fn.Output<HttpRequestQueryValidatorMiddlewareDefinition<Query, ValidationError>> {
    const query = provider.event?.rawQueryString ?? '';
    const parsed = this.parser(query);

    if (parsed === undefined) {
      return error<HttpRequestQueryValidatorResponseError.QueryStringMalformed>(
        'query',
        'malformed',
      );
    }

    const result = this.validator(parsed);

    if (result.success === false) {
      return error<HttpRequestQueryValidatorResponseError.QueryValidationFailure<ValidationError>>(
        'query',
        'validation',
        result.errors,
      );
    }

    return next({
      ...context,

      query: result.data as unknown as Query,
    });
  }
}

export class HttpRequestQueryValidatorMiddlewareUsingZod<Query extends Grok.Constraint.ObjectLike> extends HttpRequestQueryValidatorMiddleware<Query, ZodIssue[]> {
  public constructor(schema: ZodSchema) {
    super(query, validate(schema));
  }
}
