import { HandlerContextBase } from '@phasma/handler/src/component/context';
import { HandlerDefinition, HandlerFunctionParameters, HandlerFunctionResponse, HandlerImplementationWithHandleFunction } from '@phasma/handler/src/component/handler';
import { HandlerProvider } from '@phasma/handler/src/component/provider';
import { HandlerResponsePresetNothing } from '@phasma/handler/src/component/response';
import { HandlerBuilder } from '@phasma/handler/src/core/builder';
import { nothing } from '@phasma/handler/src/response';

export type ExampleProvider = HandlerProvider<'provider:foo'>;

export type ExampleHandler = HandlerDefinition<ExampleProvider, HandlerContextBase, HandlerResponsePresetNothing>;

export class ExampleHandlerImplementation implements HandlerImplementationWithHandleFunction<ExampleHandler> {
  async handle({ provider, context }: HandlerFunctionParameters<ExampleHandler>): Promise<HandlerFunctionResponse<ExampleHandler>> {
    provider.id; // "provider:foo"
    context.request.id; // "some-id"

    return nothing();
  }
}

declare const builder: HandlerBuilder<ExampleProvider, HandlerContextBase, HandlerResponsePresetNothing>;

const handler = builder.handle(new ExampleHandlerImplementation());

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
