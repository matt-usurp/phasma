import { HttpResponseTransformerMiddlewareUsingJsonEncoding } from '@phasma/handler-aws/src/http/middlware/http-response-transformer';
import { aws, Event, Handler } from '@phasma/handler-aws/src/index';
import { http, HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';

type EventSourceIdentifier = Event.Identifier<'apigw:proxy:v2'>;

type ExampleResponse = HttpResponseTransport<200, {
  name: string;
}>;

type Definition = Handler.Definition<EventSourceIdentifier, Handler.Context, HttpResponse<ExampleResponse>>;

export class ExampleHandler implements Handler.Implementation<Definition> {
  /**
   * @inheritdoc
   */
  public async handle(): Handler.Fn.Output<Definition> {
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
    .use(new HttpResponseTransformerMiddlewareUsingJsonEncoding())
    .handle(new ExampleHandler())
));

// target(
//   {} // as require('aws-lambda').APIGatewayProxyEventV2,
//   {} // as require('aws-lambda').Context,
// );
