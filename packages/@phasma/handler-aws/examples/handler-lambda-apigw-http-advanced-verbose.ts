import { WithHttpRequestBody, WithHttpRequestBodyContext } from '@phasma/handler-aws/src/http/middlware/http-request-body';
import { WithHttpRequestPath, WithHttpRequestPathContext } from '@phasma/handler-aws/src/http/middlware/http-request-path';
import { WithHttpRequestQuery, WithHttpRequestQueryContext } from '@phasma/handler-aws/src/http/middlware/http-request-query';
import { WithHttpResponseUsingJsonEncoding } from '@phasma/handler-aws/src/http/middlware/http-response';
import { aws, Event, Handler } from '@phasma/handler-aws/src/index';
import * as json from '@phasma/handler/src/http/body/json';
import * as query from '@phasma/handler/src/http/query';
import { http, HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';
import { FromType, validate } from '@phasma/handler/src/http/validator/zod';
import { z, ZodIssue } from 'zod';

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
    .use(new WithHttpResponseUsingJsonEncoding())
    .use(new WithHttpRequestPath<ExampleRequestPath, ZodIssue[]>(
      validate<ExampleRequestPath>(
        z.object<FromType<ExampleRequestPath>>({
          user: z.string().uuid(),
        }),
      ),
    ))
    .use(new WithHttpRequestQuery<ExampleRequestQuery, ZodIssue[]>(
      query.parse,
      validate<ExampleRequestQuery>(
        z.object<FromType<ExampleRequestQuery>>({
          page: z.number(),
          limit: z.number(),
        }),
      ),
    ))
    .use(new WithHttpRequestBody<ExampleRequestBody, ZodIssue[]>(
      json.decode,
      validate<ExampleRequestBody>(
        z.object<FromType<ExampleRequestBody>>({
          name: z.string().min(1),
        }),
      ),
    ))
    .handle(new ExampleHandler())
));

// target(
//   {} // as require('aws-lambda').APIGatewayProxyEventV2,
//   {} // as require('aws-lambda').Context,
// );
