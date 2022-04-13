import { HttpBodyTransformerMiddleware } from '@phasma/handler-aws/src/http/middlware/http-body-transformer';
import { HttpTransformerMiddleware } from '@phasma/handler-aws/src/http/middlware/http-transformer';
import { aws, Event, Handler } from '@phasma/handler-aws/src/index';
import { json } from '@phasma/handler/src/http/body';
import { http, HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';

type EventSourceIdentifier = Event.Source<'apigw:proxy:v2'>;

type ExampleResponse = HttpResponseTransport<200, {
  name: string;
}>;

type Definition = Handler.Definition<EventSourceIdentifier, Handler.Context, HttpResponse<ExampleResponse>>;

export class ExampleHandler implements Handler.Implementation<Definition> {
  public async handle(): Handler.Fn.Response<Definition> {
    return http<ExampleResponse>({
      status: 200,
      body: {
        name: 'bob',
      },
    });
  }
}

export const target = aws<EventSourceIdentifier>(async (application) => (
  application
    .use(new HttpTransformerMiddleware())
    .use(new HttpBodyTransformerMiddleware(json))
    .handle(new ExampleHandler())
));

// target(
//   {} // as require('aws-lambda').APIGatewayProxyEventV2,
//   {} // as require('aws-lambda').Context,
// );
