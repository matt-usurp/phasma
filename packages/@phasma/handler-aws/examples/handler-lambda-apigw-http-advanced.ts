import { WithHttpRequestBodyContext, WithHttpRequestBodyUsingZod } from '@phasma/handler-aws/src/http/middlware/http-request-body';
import { WithHttpRequestPathContext, WithHttpRequestPathUsingZod } from '@phasma/handler-aws/src/http/middlware/http-request-path';
import { WithHttpRequestQueryContext, WithHttpRequestQueryUsingZod } from '@phasma/handler-aws/src/http/middlware/http-request-query';
import { WithHttpResponseUsingJson } from '@phasma/handler-aws/src/http/middlware/http-response';
import { aws, Event, Handler } from '@phasma/handler-aws/src/index';
import { http, HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';
import type { FromType } from '@phasma/handler/src/http/validator/zod';
import { z } from 'zod';

type EventSourceIdentifier = Event.Identifier<'apigw:proxy:v2'>;

type ExampleRequestPath = {
  user: string;
};

type ExampleRequestQuery = {
  page: number;
  limit: number;
};

type ExampleRequestBody = {
  name: string;
};

type ExampleResponseBody = {
  name: string;
};

type ExampleResponse = HttpResponseTransport<200, ExampleResponseBody>;

type Context = (
  & WithHttpRequestPathContext<ExampleRequestPath>
  & WithHttpRequestQueryContext<ExampleRequestQuery>
  & WithHttpRequestBodyContext<ExampleRequestBody>
);

type Definition = Handler.Definition<EventSourceIdentifier, Context, HttpResponse<ExampleResponse>>;

/**
 * @endpoint POST /users/{user}
 */
export class ExampleHandler implements Handler.Implementation<Definition> {
  /**
   * @inheritdoc
   */
  public async handle({ context }: Handler.Fn.Input<Definition>): Handler.Fn.Output<Definition> {
    context.path.user; // from HttpRequestPathValidatorMiddleware
    context.body.name; // from HttpRequestBodyValidatorMiddleware

    context.query.page; // from HttpRequesQueryValidatorMiddleware
    context.query.limit; // from HttpRequesQueryValidatorMiddleware

    return http<ExampleResponse>({
      status: 200,
      body: {
        name: context.body.name,
      },
    });
  }
}

export const target = aws<EventSourceIdentifier>(async (application) => (
  application
    .use(new WithHttpResponseUsingJson())
    .use(new WithHttpRequestPathUsingZod<ExampleRequestPath>(
      z.object<FromType<ExampleRequestPath>>({
        user: z.string().uuid(),
      }),
    ))
    .use(new WithHttpRequestQueryUsingZod<ExampleRequestQuery>(
      z.object<FromType<ExampleRequestQuery>>({
        page: z.number(),
        limit: z.number(),
      }),
    ))
    .use(new WithHttpRequestBodyUsingZod<ExampleRequestBody>(
      z.object<FromType<ExampleRequestBody>>({
        name: z.string().min(1),
      }),
    ))
    .handle(new ExampleHandler())
));

// target(
//   {} // as require('aws-lambda').APIGatewayProxyEventV2,
//   {} // as require('aws-lambda').Context,
// );
