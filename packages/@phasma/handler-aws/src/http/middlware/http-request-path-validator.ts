import type { Grok } from '@matt-usurp/grok';
import { error } from '@phasma/handler/src/http/response';
import type { HttpValidatorFunction } from '@phasma/handler/src/http/validator';
import { validate } from '@phasma/handler/src/http/validator/zod';
import type { ZodIssue, ZodSchema } from 'zod';
import type { Http, Middleware, Provider } from '../../index';

export type HttpRequestPathValidatorResponseError<Error> = (
  | HttpRequestPathValidatorResponseError.PathMissing
  | HttpRequestPathValidatorResponseError.PathValidationFailure<Error>
);

export namespace HttpRequestPathValidatorResponseError {
  export type PathMissing = Http.Response.Error<'path', 'missing', undefined>;
  export type PathValidationFailure<Error> = Http.Response.Error<'path', 'validation', Error>;
}

export type HttpRequestPathValidatorContext<T> = {
  /**
   * Path parameters parsed and made available via {@link HttpRequesPathValidatorMiddleware}.
   */
  readonly path: T;
};

export type HttpRequestPathValidatorMiddlewareDefinition<Path, ValidationError> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Provider.ForEvent<'apigw:proxy:v2'>,
    Middleware.Definition.Any.ContextInbound,
    HttpRequestPathValidatorContext<Path>,
    Middleware.Definition.Any.ResponseInbound,
    HttpRequestPathValidatorResponseError<ValidationError>
  >
/* eslint-enable @typescript-eslint/indent */
);

export class HttpRequestPathValidatorMiddleware<Path extends Grok.Constraint.ObjectLike, ValidationError> implements Middleware.Implementation<HttpRequestPathValidatorMiddlewareDefinition<Path, ValidationError>> {
  public constructor(
    public readonly validator: HttpValidatorFunction<Grok.Constraint.ObjectLike, ValidationError>,
  ) {}

  /**
   * @inheritdoc
   */
  public async invoke({ provider, context, next }: Middleware.Fn.Input<HttpRequestPathValidatorMiddlewareDefinition<Path, ValidationError>>): Middleware.Fn.Output<HttpRequestPathValidatorMiddlewareDefinition<Path, ValidationError>> {
    const path = provider.event?.pathParameters;

    if (path === undefined) {
      return error<HttpRequestPathValidatorResponseError.PathMissing>(
        'path',
        'missing',
      );
    }

    const result = this.validator(path);

    if (result.success === false) {
      return error<HttpRequestPathValidatorResponseError.PathValidationFailure<ValidationError>>(
        'path',
        'validation',
        result.errors,
      );
    }

    return next({
      ...context,

      path: result.data as unknown as Path,
    });
  }
}

export class HttpRequestPathValidatorMiddlewareUsingZod<Path extends Grok.Constraint.ObjectLike> extends HttpRequestPathValidatorMiddleware<Path, ZodIssue[]> {
  public constructor(schema: ZodSchema) {
    super(validate(schema));
  }
}
