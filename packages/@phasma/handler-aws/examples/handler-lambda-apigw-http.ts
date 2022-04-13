import { HttpBodyTransformerMiddleware } from '@phasma/handler-aws/src/http/middlware/http-body-transformer';
import { HttpTransformerMiddleware } from '@phasma/handler-aws/src/http/middlware/http-transformer';
import { aws, Event, Handler } from '@phasma/handler-aws/src/index';
import { json } from '@phasma/handler/src/http/body';
import { http, HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';

export type EventSource = Event.Source<'apigw:proxy:v2'>;

export type ExampleHandlerResponse = HttpResponseTransport<200, {
  name: string;
}>;

export type ExampleHandlerDefinition = Handler.Definition<EventSource, Handler.Context, HttpResponse<ExampleHandlerResponse>>;

export class ExampleHandler implements Handler.Implementation<ExampleHandlerDefinition> {
  public async handle(): Handler.Fn.Response<ExampleHandlerDefinition> {
    return http<ExampleHandlerResponse>({
      status: 200,
      body: {
        name: 'bob',
      },
    });
  }
}

export const target = aws<EventSource>(async (inbound) => (
  inbound
    .use(new HttpTransformerMiddleware())
    .use(new HttpBodyTransformerMiddleware(json))
    .handle(new ExampleHandler())
));

// target(
//   {} // as require('aws-lambda').APIGatewayProxyEventV2,
//   {} // as require('aws-lambda').Context,
// );
