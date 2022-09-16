import { HttpRequestBodyValidatorContext, HttpRequestBodyValidatorMiddleware } from '@phasma/handler-aws/src/http/middlware/http-request-body-validator';
import { HttpRequestPathValidatorContext, HttpRequestPathValidatorMiddleware } from '@phasma/handler-aws/src/http/middlware/http-request-path-validator';
import { HttpRequesQueryValidatorMiddleware, HttpRequestQueryValidatorContext } from '@phasma/handler-aws/src/http/middlware/http-request-query-validator';
import { HttpResponseBodyEncoderMiddleware } from '@phasma/handler-aws/src/http/middlware/http-response-body-encoder';
import { HttpResponseTransformerMiddleware } from '@phasma/handler-aws/src/http/middlware/http-response-transformer';
import { aws, Event, Handler } from '@phasma/handler-aws/src/index';
import * as json from '@phasma/handler/src/http/body/json';
import * as query from '@phasma/handler/src/http/query';
import { http, HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';
import * as zod from '@phasma/handler/src/http/validator/zod';
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
  & HttpRequestPathValidatorContext<ExampleRequestPath>
  & HttpRequestQueryValidatorContext<ExampleRequestQuery>
  & HttpRequestBodyValidatorContext<ExampleRequestBody>
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
    .use(HttpResponseTransformerMiddleware.create())
    .use(HttpResponseBodyEncoderMiddleware.create(json.encode))
    .use(HttpRequestPathValidatorMiddleware.create<ExampleRequestPath>(zod.validate<ExampleRequestPath>(
      z.object<zod.FromType<ExampleRequestPath>>({
        user: z.string().uuid(),
      }),
    )))
    .use(HttpRequesQueryValidatorMiddleware.create<ExampleRequestQuery>(query.parse, zod.validate<ExampleRequestQuery>(
      z.object<zod.FromType<ExampleRequestQuery>>({
        page: z.number(),
        limit: z.number(),
      }),
    )))
    .use(HttpRequestBodyValidatorMiddleware.create<ExampleRequestBody>(json.decode, zod.validate<ExampleRequestBody>(
      z.object<zod.FromType<ExampleRequestBody>>({
        name: z.string().nonempty(),
      }),
    )))
    .handle(new ExampleHandler())
));

// target(
//   {} // as require('aws-lambda').APIGatewayProxyEventV2,
//   {} // as require('aws-lambda').Context,
// );
