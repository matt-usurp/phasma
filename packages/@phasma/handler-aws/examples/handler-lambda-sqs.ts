import { aws, Event, Handler } from '@phasma/handler-aws/src/index';
import { nothing } from '@phasma/handler/src/response';

export type EventSource = Event.Source<'sqs'>;

export type SomeHandlerDefinition = Handler.Definition<EventSource>;

export class SomeHandler implements Handler.Implementation<SomeHandlerDefinition> {
  public async handle({ provider }: Handler.Fn.Parameters<SomeHandlerDefinition>): Handler.Fn.Response<SomeHandlerDefinition> {
    provider.id; // "provider:aws"
    provider.payload.Records; // SQSRecord[]

    return nothing();
  }
}

export const target = aws<EventSource>(async (inbound) => (
  inbound
    .handle(new SomeHandler())
));

// target(
//   {} // as require('aws-lambda').SQSEvent,
//   {} // as require('aws-lambda').Context,
// );
