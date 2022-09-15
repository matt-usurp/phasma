import type { Grok } from '@matt-usurp/grok';
import type { HandlerProvider, HandlerProviderIdentifier } from './provider';

it('ignored, only type tests', (): void => {
  expect(true).toStrictEqual(true);
});

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * {@link HandlerProviderIdentifier}
 */
export namespace Test_HandlerProviderIdentifier {
  type Case_WithOne = Grok.Assert<HandlerProviderIdentifier<'one'>, 'provider:one'>;
  type Case_WithTwo = Grok.Assert<HandlerProviderIdentifier<'two'>, 'provider:two'>;
  type Case_WithThree = Grok.Assert<HandlerProviderIdentifier<'three'>, 'provider:three'>;
}

/**
 * {@link HandlerProvider}
 */
export namespace Test_HandlerProvider {
  type Case_WithStructureOne = Grok.Assert<HandlerProvider<HandlerProviderIdentifier<'one'>>, {
    readonly id: 'provider:one';
  }>;

  type Case_WithStructureTwo = Grok.Assert<HandlerProvider<HandlerProviderIdentifier<'two'>>, {
    readonly id: 'provider:two';
  }>;
}
