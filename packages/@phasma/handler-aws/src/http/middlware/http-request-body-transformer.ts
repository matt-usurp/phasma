import type { Grok } from '@matt-usurp/grok';
import type { HttpBodyDecoder } from '@phasma/handler/src/http/body';
import { decode as json } from '@phasma/handler/src/http/body/json';
import { error } from '@phasma/handler/src/http/response';
import type { HttpValidatorFunction } from '@phasma/handler/src/http/validator';
import { validate } from '@phasma/handler/src/http/validator/zod';
import type { ZodIssue, ZodSchema } from 'zod';
import type { Http, Middleware, Provider } from '../../index';

export type HttpRequestBodyValidatorResponseError<Error> = (
  | HttpRequestBodyValidatorResponseError.BodyMissing
  | HttpRequestBodyValidatorResponseError.BodyMalformed
  | HttpRequestBodyValidatorResponseError.BodyValidationFailure<Error>
);

export namespace HttpRequestBodyValidatorResponseError {
  export type BodyMissing = Http.Response.Error<'body', 'missing', undefined>;
  export type BodyMalformed = Http.Response.Error<'body', 'malformed', undefined>;
  export type BodyValidationFailure<Error> = Http.Response.Error<'body', 'validation', Error>;
}

export type HttpRequestBodyValidatorContext<Body> = {
  /**
   * The request body parsed, validated and made available via {@link HttpRequestBodyTransformerMiddleware}.
   */
  readonly body: Body;
};

export type HttpRequestBodyValidatorMiddlewareDefinition<Body, ValidationError> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Provider.ForEvent<'apigw:proxy:v2'>,
    Middleware.Definition.Any.ContextInbound,
    HttpRequestBodyValidatorContext<Body>,
    Middleware.Definition.Any.ResponseInbound,
    HttpRequestBodyValidatorResponseError<ValidationError>
  >
/* eslint-enable @typescript-eslint/indent */
);

export class HttpRequestBodyTransformerMiddleware<Body, ValidationError> implements Middleware.Implementation<HttpRequestBodyValidatorMiddlewareDefinition<Body, ValidationError>> {
  public constructor(
    public readonly decoder: HttpBodyDecoder<Grok.Constraint.ObjectLike>,
    public readonly validator: HttpValidatorFunction<Grok.Constraint.ObjectLike, ValidationError>,
  ) {}

  /**
   * @inheritdoc
   */
  public async invoke({ provider, context, next }: Middleware.Fn.Input<HttpRequestBodyValidatorMiddlewareDefinition<Body, ValidationError>>): Middleware.Fn.Output<HttpRequestBodyValidatorMiddlewareDefinition<Body, ValidationError>> {
    const body = provider.event?.body;

    if (body === undefined || body === '') {
      return error<HttpRequestBodyValidatorResponseError.BodyMissing>(
        'body',
        'missing',
      );
    }

    const payload = this.decoder(body);

    if (payload === undefined) {
      return error<HttpRequestBodyValidatorResponseError.BodyMalformed>(
        'body',
        'malformed',
      );
    }

    const result = this.validator(payload);

    if (result.success === false) {
      return error<HttpRequestBodyValidatorResponseError.BodyValidationFailure<ValidationError>>(
        'body',
        'validation',
        result.errors,
      );
    }

    return next({
      ...context,

      body: result.data as unknown as Body,
    });
  }
}

export class HttpRequestBodyTransformerMiddlewareUsingZod<Body> extends HttpRequestBodyTransformerMiddleware<Body, ZodIssue[]> {
  public constructor(schema: ZodSchema) {
    super(json, validate(schema));
  }
}
