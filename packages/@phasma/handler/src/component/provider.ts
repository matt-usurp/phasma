/**
 * A template for provider identifiers.
 *
 * All provider identifiers should be prefixed with `provider:`, this enforces uniqueness over other identifiers used in the project.
 * This uses the given {@link Identifier} and constructs a compliant type.
 */
export type HandlerProviderIdentifier<Identifier extends string> = `provider:${Identifier}`;

/**
 * A constraint type for {@link HandlerProviderIdentifier}.
 */
export type HandlerProviderIdentifierConstraint = HandlerProviderIdentifier<string>;

/**
 * A provider representation.
 *
 * This simply contains the {@link HandlerProviderIdentifier} as a requirement to ensure uniqueness.
 * Depending on the specific provider integration other values can be present here.
 * This is simply a base type.
 */
export type HandlerProvider<Identifier extends HandlerProviderIdentifierConstraint> = {
  readonly id: Identifier;
};

/**
 * A constraint type for {@link HandlerProvider}.
 */
export type HandlerProviderConstraint = (
/* eslint-disable @typescript-eslint/indent */
  HandlerProvider<
    any // eslint-disable-line @typescript-eslint/no-explicit-any
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * The below import(s) and namespace allows this file to compose a better developer experience through type aliasing.
 * Here we define a series of aliases that provide better naming and a single type import.
 * This is then aliased in the root file with a better name also.
 */
import * as provider from './provider';

export namespace HandlerProvider {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Identifier = provider.HandlerProviderIdentifier;
}
