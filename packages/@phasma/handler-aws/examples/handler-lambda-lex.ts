import type { Event, Handler } from '@phasma/handler-aws/src/index';
import { aws } from '@phasma/handler-aws/src/index';
import { result } from '@phasma/handler-aws/src/response';

type EventSourceIdentifier = Event.Identifier<'lex'>;

type Definition = Handler.Definition<EventSourceIdentifier>;

export class SomeHandler implements Handler.Implementation<Definition> {
  /**
   * @inheritdoc
   */
  public async handle({ provider }: Handler.Fn.Input<Definition>): Handler.Fn.Output<Definition> {
    provider.id; // "provider:aws"
    provider.event; // LexEvent

    return result<Event.ResponseValue<EventSourceIdentifier>>({
      dialogAction: {
        type: 'ConfirmIntent',
        intentName: 'some-name',
        slots: {},
      },
    });
  }
}

export const target = aws<EventSourceIdentifier>(async (application) => (
  application
    .handle(new SomeHandler())
));

// target(
//   {} // as require('aws-lambda').LexEvent,
//   {} // as require('aws-lambda').Context,
// );
