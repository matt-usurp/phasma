import { HandlerContextBase } from '@phasma/handler/src/component/context';
import { HandlerDefinition, HandlerFunctionParameters, HandlerFunctionResponse, HandlerImplementationWithHandleFunction } from '@phasma/handler/src/component/handler';
import { HandlerProvider } from '@phasma/handler/src/component/provider';
import { HandlerResponsePresetNothing } from '@phasma/handler/src/component/response';
import { HandlerBuilder } from '@phasma/handler/src/core/builder';
import { nothing } from '@phasma/handler/src/response';

export type SomeProvider = HandlerProvider<'provider:foo'>;

export type SomeHandler = HandlerDefinition<SomeProvider, HandlerContextBase, HandlerResponsePresetNothing>;

export class SomeHandlerImplementation implements HandlerImplementationWithHandleFunction<SomeHandler> {
  async handle({ provider, context }: HandlerFunctionParameters<SomeHandler>): Promise<HandlerFunctionResponse<SomeHandler>> {
    provider.id;
    context.request.id;

    return nothing();
  }
}

declare const builder: HandlerBuilder<SomeProvider, HandlerContextBase, HandlerResponsePresetNothing>;

const handler = builder.handle(new SomeHandlerImplementation());

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
