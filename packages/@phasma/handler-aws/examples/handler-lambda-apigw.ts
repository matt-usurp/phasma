import { aws, Event, Handler } from '@phasma/handler-aws/src/index';

export type EventSource = Event.Source<'apigw:proxy:v2'>;

export type SomeHandlerDefinition = Handler.Definition<EventSource>;

export class SomeHandler implements Handler.Implementation<SomeHandlerDefinition> {
  public async handle({ provider, context }: Handler.Fn.Parameters<SomeHandlerDefinition>): Handler.Fn.Response<SomeHandlerDefinition> {
    provider.id;
    provider.payload.headers;

    context.request.id;

    throw undefined;
  }
}

export const target = aws<EventSource>(async (inbound) => (
  inbound
    .handle(new SomeHandler())
));

// target(
//   {} // as require('aws-lambda').APIGatewayProxyEventV2,
//   {} // as require('aws-lambda').Context,
// );
