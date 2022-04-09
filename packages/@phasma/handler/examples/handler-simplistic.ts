import type { HandlerProvider } from '@phasma/handler/src/component/provider';
import type { HandlerBuilder } from '@phasma/handler/src/core/builder';
import { nothing } from '@phasma/handler/src/response';
import type { Handler } from '../src/index';

export type ExampleProvider = HandlerProvider<'provider:foo'>;

export type ExampleHandlerDefinition = Handler.Definition<ExampleProvider, Handler.Context, Handler.Response.Nothing>;

export class ExampleHandler implements Handler.Implementation<ExampleHandlerDefinition> {
  public async handle({ provider, context }: Handler.Fn.Parameters<ExampleHandlerDefinition>): Handler.Fn.Response<ExampleHandlerDefinition> {
    provider.id; // "provider:foo"
    context.request.id; // "some-id"

    return nothing();
  }
}

declare const builder: HandlerBuilder<ExampleProvider, Handler.Context, Handler.Response.Nothing>;

const handler = builder.handle(new ExampleHandler());

handler({
  provider: {
    id: 'provider:foo',
  },

  context: {
    request: {
      id: 'some-id',
    },
  },
});
