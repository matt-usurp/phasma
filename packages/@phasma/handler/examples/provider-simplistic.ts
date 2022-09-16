import type { Grok } from '@matt-usurp/grok';
import type { HandlerContextBase } from '@phasma/handler/src/component/context';
import type { HandlerClassImplementation, HandlerComposition, HandlerEntrypoint } from '@phasma/handler/src/component/handler';
import type { HandlerProvider, HandlerProviderIdentifier } from '@phasma/handler/src/component/provider';
import type { HandlerResponse, HandlerResponseIdentifier } from '@phasma/handler/src/component/response';
import type { HandlerComposer } from '@phasma/handler/src/core/handler/composer';

/**
 * This payload represents the data being provided to your function.
 * This can be anything, in this example we have some kind of event handler.
 */
export type ExampleProviderPayload = {
  readonly id: string;
  readonly timestamp: number;
  readonly origin: string;
  readonly destination: string;
  readonly event: unknown;
};

export type ExampleProviderIdentifier = HandlerProviderIdentifier<'example'>;
export type ExampleProvider = HandlerProvider<'provider:foo'>;
export type ExampleProviderWithPayload = (
  & HandlerProvider<ExampleProviderIdentifier>
  & {
    readonly payload: ExampleProviderPayload;
  }
);

// --
// -- Context
// --

export type ExampleHandlerContextBase = (
  & HandlerContextBase
  & {
    readonly request: {
      readonly timestamp: number;
    };
  }
);

// --
// -- Response
// --

export type ExampleHandlerResponseIdentifier = HandlerResponseIdentifier<'json'>;
export type ExampleHandlerResponse = HandlerResponse<ExampleHandlerResponseIdentifier, {
  json: string;
}>;

// --
// -- Provider
// --

export type ExampleHandlerComposer = (
/* eslint-disable @typescript-eslint/indent */
  HandlerComposer<
    ExampleProviderWithPayload,
    ExampleHandlerContextBase,
    ExampleHandlerResponse
  >
/* eslint-enable @typescript-eslint/indent */
);

export type ExampleHandlerComposition = (
/* eslint-disable @typescript-eslint/indent */
  HandlerComposition<
    HandlerClassImplementation<Grok.Constraint.Anything>,
    ExampleProviderWithPayload,
    ExampleHandlerContextBase,
    ExampleHandlerResponse
  >
/* eslint-enable @typescript-eslint/indent */
);

export type ExampleHandlerEntrypointArguments = [
  payload: ExampleProviderPayload,
];

export type ExampleHandlerEntrypoint = (
/* eslint-disable @typescript-eslint/indent */
  HandlerEntrypoint<
    ExampleHandlerComposition,
    ExampleHandlerEntrypointArguments,
    Promise<string | undefined>
  >
/* eslint-enable @typescript-eslint/indent */
);

export const entrypoint = (composition: ExampleHandlerComposition): ExampleHandlerEntrypoint => async (payload) => {
  const result = await composition({
    provider: {
      id: 'provider:example',
      payload,
    },

    context: {
      id: payload.id,

      request: {
        timestamp: payload.timestamp,
      },
    },
  });

  if (result.type === 'response:json') {
    return result.value.json;
  }

  return undefined;
};
