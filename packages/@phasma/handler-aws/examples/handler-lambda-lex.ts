import { aws, Event, Handler } from '@phasma/handler-aws/src/index';
import { result } from '@phasma/handler-aws/src/response';

export type EventSource = Event.Source<'lex'>;

export type SomeHandlerDefinition = Handler.Definition<EventSource>;

export class SomeHandler implements Handler.Implementation<SomeHandlerDefinition> {
  public async handle({ provider }: Handler.Fn.Parameters<SomeHandlerDefinition>): Handler.Fn.Response<SomeHandlerDefinition> {
    provider.id; // "provider:aws"
    provider.payload; // LexEvent

    return result<Event.Result<EventSource>>({
      dialogAction: {
        type: 'ConfirmIntent',
        intentName: 'some-name',
        slots: {},
      },
    });
  }
}

export const target = aws<EventSource>((inbound) => (
  inbound
    .handle(new SomeHandler())
));

// target(
//   {} // as require('aws-lambda').LexEvent,
//   {} // as require('aws-lambda').Context,
// );
