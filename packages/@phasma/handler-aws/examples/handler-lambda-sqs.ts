import { aws, Event, Handler } from '@phasma/handler-aws/src/index';
import { nothing } from '@phasma/handler/src/response';

type EventSourceIdentifier = Event.Source<'sqs'>;

type Definition = Handler.Definition<EventSourceIdentifier>;

export class SomeHandler implements Handler.Implementation<Definition> {
  public async handle({ provider }: Handler.Fn.Parameters<Definition>): Handler.Fn.Response<Definition> {
    provider.id; // "provider:aws"
    provider.payload.Records; // SQSRecord[]

    return nothing();
  }
}

export const target = aws<EventSourceIdentifier>(async (application) => (
  application
    .handle(new SomeHandler())
));

// target(
//   {} // as require('aws-lambda').SQSEvent,
//   {} // as require('aws-lambda').Context,
// );
