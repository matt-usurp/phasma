import type { Event, Handler } from '@phasma/handler-aws/src/index';
import { aws } from '@phasma/handler-aws/src/index';

type EventSourceIdentifier = Event.Identifier<'apigw:proxy:v2'>;

type Definition = Handler.Definition<EventSourceIdentifier>;

export class SomeHandler implements Handler.Implementation<Definition> {
  /**
   * @inheritdoc
   */
  public async handle({ provider, context }: Handler.Fn.Input<Definition>): Handler.Fn.Output<Definition> {
    provider.id;
    provider.event.headers;

    context.id;

    throw new Error();
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
