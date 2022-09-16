import type { Grok } from '@matt-usurp/grok';
import type { Provider } from '../index';
import type { HandlerProvider, HandlerProviderIdentifier } from './provider';

it('ignored, only type tests', (): void => {
  expect(true).toStrictEqual(true);
});

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * {@link HandlerProviderIdentifier}
 */
export namespace Test_HandlerProviderIdentifier {
  /**
   * {@link HandlerProviderIdentifier}
   */
  export namespace Test_HandlerProviderIdentifier {
    type Case_WithOne = Grok.Assert<HandlerProviderIdentifier<'one'>, 'provider:one'>;
    type Case_WithTwo = Grok.Assert<HandlerProviderIdentifier<'two'>, 'provider:two'>;
    type Case_WithThree = Grok.Assert<HandlerProviderIdentifier<'three'>, 'provider:three'>;
  }

  /**
   * {@link Provider.Identifier}
   */
  export namespace Test_HandlerProviderIdentifier_UsingAlias {
    type Case_WithOne = Grok.Assert<Provider.Identifier<'one'>, 'provider:one'>;
    type Case_WithTwo = Grok.Assert<Provider.Identifier<'two'>, 'provider:two'>;
    type Case_WithThree = Grok.Assert<Provider.Identifier<'three'>, 'provider:three'>;
  }
}

/**
 * {@link HandlerProvider}
 */
export namespace Test_HandlerProvider {
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

  /**
   * {@link Provider}
   */
  export namespace Test_HandlerProvider_UsingAlias {
    type Case_WithStructureOne = Grok.Assert<Provider<Provider.Identifier<'one'>>, {
      readonly id: 'provider:one';
    }>;

    type Case_WithStructureTwo = Grok.Assert<Provider<Provider.Identifier<'two'>>, {
      readonly id: 'provider:two';
    }>;
  }
}
