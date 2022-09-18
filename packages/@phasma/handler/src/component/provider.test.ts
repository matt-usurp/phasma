import type { Grok } from '@matt-usurp/grok';
import type { Provider } from '../index';
import type { HandlerProvider, HandlerProviderIdentifier } from './provider';

it('types', (): void => expect(true).toBeTruthy());

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @internal {@link HandlerProviderIdentifier}
 */
export namespace Test_HandlerProviderIdentifier {
  /**
   * @internal {@link HandlerProviderIdentifier}
   */
  export namespace Test_HandlerProviderIdentifier {
    type Assert_CompatibleWithExpectedIdentifierFormat = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerProviderIdentifier<'example'>,
          'provider:example'
        >
      >
    );
  }

  /**
   * @internal {@link Provider.Identifier}
   */
  export namespace Test_HandlerProviderIdentifier_UsingAlias {
    type Assert_CompatibleWithExpectedIdentifierFormat = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Provider.Identifier<'example'>,
          'provider:example'
        >
      >
    );
  }
}

/**
 * @internal {@link HandlerProvider}
 */
export namespace Test_HandlerProvider {
  /**
   * @internal {@link HandlerProvider}
   */
  export namespace Test_HandlerProvider {
    type Assert_CompatibleWithExpectedStructure = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          HandlerProvider<
            HandlerProviderIdentifier<'one'>
          >,
          { id: 'provider:one' }
        >
      >
    );
  }

  /**
   * @internal {@link Provider}
   */
  export namespace Test_HandlerProvider_UsingAlias {
    type Assert_CompatibleWithExpectedStructure = (
      Grok.Assert.IsTrue<
        Grok.Value.IsExactly<
          Provider<
            Provider.Identifier<'one'>
          >,
          { id: 'provider:one' }
        >
      >
    );
  }
}
