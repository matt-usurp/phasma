import { aws, Event, Handler } from '@phasma/handler-aws/src/index';

type EventSourceIdentifier = Event.Source<'apigw:proxy:v2'>;

type Definition = Handler.Definition<EventSourceIdentifier>;

export class SomeHandler implements Handler.Implementation<Definition> {
  public async handle({ provider, context }: Handler.Fn.Parameters<Definition>): Handler.Fn.Response<Definition> {
    provider.id;
    provider.payload.headers;

    context.request.id;

    throw undefined;
  }
}

export const target = aws<EventSourceIdentifier>(async (application) => (
  application
    .handle(new SomeHandler())
));

// target(
//   {} // as require('aws-lambda').APIGatewayProxyEventV2,
//   {} // as require('aws-lambda').Context,
// );
