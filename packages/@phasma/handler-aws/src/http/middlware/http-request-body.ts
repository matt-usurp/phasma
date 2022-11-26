import type { Grok } from '@matt-usurp/grok';
import type { HttpBodyDecoder } from '@phasma/handler/src/http/body';
import { decoder as json } from '@phasma/handler/src/http/body/json';
import { error } from '@phasma/handler/src/http/response';
import type { HttpValidatorFunction } from '@phasma/handler/src/http/validator';
import { validate } from '@phasma/handler/src/http/validator/zod';
import type { ZodIssue, ZodSchema } from 'zod';
import type { Http, Middleware, Provider } from '../../index';

export type WithHttpRequestBodyResponseError<Error> = (
  | WithHttpRequestBodyResponseError.BodyMissing
  | WithHttpRequestBodyResponseError.BodyMalformed
  | WithHttpRequestBodyResponseError.BodyValidationFailure<Error>
);

export namespace WithHttpRequestBodyResponseError {
  export type BodyMissing = Http.Response.Error<'body', 'missing', undefined>;
  export type BodyMalformed = Http.Response.Error<'body', 'malformed', undefined>;
  export type BodyValidationFailure<Error> = Http.Response.Error<'body', 'validation', Error>;
}

export type WithHttpRequestBodyContext<Body> = {
  /**
   * The request body parsed, validated and made available via {@link WithHttpRequestBody}.
   */
  readonly body: Body;
};

export type WithHttpRequestBodyDefinition<Body, ValidationError> = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Provider.ForEvent<'apigw:proxy:v2'>,
    Middleware.Definition.Any.ContextInbound,
    WithHttpRequestBodyContext<Body>,
    Middleware.Definition.Any.ResponseInbound,
    WithHttpRequestBodyResponseError<ValidationError>
  >
/* eslint-enable @typescript-eslint/indent */
);

export class WithHttpRequestBody<Body, ValidationError> implements Middleware.Implementation<WithHttpRequestBodyDefinition<Body, ValidationError>> {
  public constructor(
    public readonly decoder: HttpBodyDecoder<Grok.Constraint.ObjectLike>,
    public readonly validator: HttpValidatorFunction<Grok.Constraint.ObjectLike, ValidationError>,
  ) {}

  /**
   * @inheritdoc
   */
  public async invoke({ provider, context, next }: Middleware.Fn.Input<WithHttpRequestBodyDefinition<Body, ValidationError>>): Middleware.Fn.Output<WithHttpRequestBodyDefinition<Body, ValidationError>> {
    const body = provider.event?.body;

    if (body === undefined || body === '') {
      return error<WithHttpRequestBodyResponseError.BodyMissing>(
        'body',
        'missing',
      );
    }

    const payload = this.decoder(body);

    if (payload === undefined) {
      return error<WithHttpRequestBodyResponseError.BodyMalformed>(
        'body',
        'malformed',
      );
    }

    const result = this.validator(payload);

    if (result.success === false) {
      return error<WithHttpRequestBodyResponseError.BodyValidationFailure<ValidationError>>(
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

export class WithHttpRequestBodyUsingZod<Body> extends WithHttpRequestBody<Body, ZodIssue[]> {
  public constructor(schema: ZodSchema) {
    super(json, validate(schema));
  }
}
