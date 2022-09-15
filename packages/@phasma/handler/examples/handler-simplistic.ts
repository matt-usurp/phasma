import type { HandlerProvider } from '@phasma/handler/src/component/provider';
import type { HandlerComposer } from '@phasma/handler/src/core/handler/composer';
import { nothing } from '@phasma/handler/src/response';
import type { Handler } from '../src/index';

export type ExampleProvider = HandlerProvider<'provider:foo'>;

export type ExampleHandlerDefinition = Handler.Definition<ExampleProvider, Handler.Context, Handler.Response.Nothing>;

export class ExampleHandler implements Handler.Implementation<ExampleHandlerDefinition> {
  public async handle({ provider, context }: Handler.Fn.Input<ExampleHandlerDefinition>): Handler.Fn.Output<ExampleHandlerDefinition> {
    provider.id; // "provider:foo"
    context.id; // "some-id"

    return nothing();
  }
}

declare const composer: HandlerComposer<ExampleProvider, Handler.Context, Handler.Response.Nothing>;

const handler = composer.handle(new ExampleHandler());

// eslint-disable-next-line @typescript-eslint/no-floating-promises
handler({
  provider: {
    id: 'provider:foo',
  },

  context: {
    id: 'some-id',
  },
});
