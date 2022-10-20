import type { Grok } from '@matt-usurp/grok';
import type { HttpQueryParser } from '@phasma/handler/src/http/query';
import { parse as query } from '@phasma/handler/src/http/query';
import { error } from '@phasma/handler/src/http/response';
import type { HttpValidatorFunction } from '@phasma/handler/src/http/validator';
import { validate } from '@phasma/handler/src/http/validator/zod';
import type { ZodIssue, ZodSchema } from 'zod';
import type { Http, Middleware, Provider } from '../../index';

export type WithHttpRequestQueryResponseError<Error> = (
  | WithHttpRequestQueryResponseError.QueryStringMalformed
  | WithHttpRequestQueryResponseError.QueryValidationFailure<Error>
);

export namespace WithHttpRequestQueryResponseError {
  export type QueryStringMalformed = Http.Response.Error<'query', 'malformed', undefined>;
  export type QueryValidationFailure<Error> = Http.Response.Error<'query', 'validation', Error>;
}

export type WithHttpRequestQueryContext<Query> = {
  /**
   * Query parameters parsed and made available via {@link WithHttpRequestQuery}.
   */
  readonly query: Query;
};

/**
 * A {@link WithHttpRequestQuery} type definition.
 */
export type WithHttpRequestQueryDefinition<Query extends Grok.Constraint.ObjectLike, ValidationError> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Provider.ForEvent<'apigw:proxy:v2'>,
    Middleware.Definition.Any.ContextInbound,
    WithHttpRequestQueryContext<Query>,
    Middleware.Definition.Any.ResponseInbound,
    WithHttpRequestQueryResponseError<ValidationError>
  >
/* eslint-enable @typescript-eslint/indent */
);

export class WithHttpRequestQuery<Query extends Grok.Constraint.ObjectLike, ValidationError> implements Middleware.Implementation<WithHttpRequestQueryDefinition<Query, ValidationError>> {
  public constructor(
    public readonly parser: HttpQueryParser<Grok.Constraint.ObjectLike>,
    public readonly validator: HttpValidatorFunction<Grok.Constraint.ObjectLike, ValidationError>,
  ) {}

  /**
   * @inheritdoc
   */
  public async invoke({ provider, context, next }: Middleware.Fn.Input<WithHttpRequestQueryDefinition<Query, ValidationError>>): Middleware.Fn.Output<WithHttpRequestQueryDefinition<Query, ValidationError>> {
    const query = provider.event?.rawQueryString ?? '';
    const parsed = this.parser(query);

    if (parsed === undefined) {
      return error<WithHttpRequestQueryResponseError.QueryStringMalformed>(
        'query',
        'malformed',
      );
    }

    const result = this.validator(parsed);

    if (result.success === false) {
      return error<WithHttpRequestQueryResponseError.QueryValidationFailure<ValidationError>>(
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

export class WithHttpRequestQueryUsingZod<Query extends Grok.Constraint.ObjectLike> extends WithHttpRequestQuery<Query, ZodIssue[]> {
  public constructor(schema: ZodSchema) {
    super(query, validate(schema));
  }
}
