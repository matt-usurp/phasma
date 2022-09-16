import type { HandlerComposer } from '@phasma/handler/src/core/handler/composer';
import type { Handler, Provider } from '@phasma/handler/src/index';
import { nothing } from '@phasma/handler/src/response';

export type ExampleProvider = Provider<Provider.Identifier<'example'>>;

export type ExampleHandlerDefinition = Handler.Definition<ExampleProvider, Handler.Context, Handler.Response.Nothing>;

export class ExampleHandler implements Handler.Implementation<ExampleHandlerDefinition> {
  /**
   * @inheritdoc
   */
  public async handle({ provider, context }: Handler.Fn.Input<ExampleHandlerDefinition>): Handler.Fn.Output<ExampleHandlerDefinition> {
    provider.id; // "provider:example"
    context.id; // "some-context-id"

    return nothing();
  }
}

declare const composer: HandlerComposer<ExampleProvider, Handler.Context, Handler.Response.Nothing>;

const handler = composer.handle(new ExampleHandler());

// eslint-disable-next-line @typescript-eslint/no-floating-promises
handler({
  provider: {
    id: 'provider:example',
  },

  context: {
    id: 'some-context-id',
  },
});
