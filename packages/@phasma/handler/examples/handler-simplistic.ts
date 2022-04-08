import type { HandlerContextBase } from '@phasma/handler/src/component/context';
import type { HandlerDefinition, HandlerFunctionParameters, HandlerFunctionResponse, HandlerImplementationWithHandleFunction } from '@phasma/handler/src/component/handler';
import type { HandlerProvider } from '@phasma/handler/src/component/provider';
import type { HandlerResponsePresetNothing } from '@phasma/handler/src/component/response';
import type { HandlerBuilder } from '@phasma/handler/src/core/builder';
import { nothing } from '@phasma/handler/src/response';

export type ExampleProvider = HandlerProvider<'provider:foo'>;

export type ExampleHandlerDefinition = HandlerDefinition<ExampleProvider, HandlerContextBase, HandlerResponsePresetNothing>;

export class ExampleHandler implements HandlerImplementationWithHandleFunction<ExampleHandlerDefinition> {
  async handle({ provider, context }: HandlerFunctionParameters<ExampleHandlerDefinition>): Promise<HandlerFunctionResponse<ExampleHandlerDefinition>> {
    provider.id; // "provider:foo"
    context.request.id; // "some-id"

    return nothing();
  }
}

declare const builder: HandlerBuilder<ExampleProvider, HandlerContextBase, HandlerResponsePresetNothing>;

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
