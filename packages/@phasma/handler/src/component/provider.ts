import type { Grok } from '@matt-usurp/grok';

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
export type HandlerProviderConstraint = HandlerProvider<Grok.Constraint.Anything>;

/**
 * A {@link HandlerProvider} with some {@link Payload} attached.
 *
 * @deprecated use provider specialised type instead, providers might use with own terminology instead of "payload".
 */
export type HandlerProviderWithPayload<
  Identifier extends HandlerProviderIdentifierConstraint,
  Payload,
> = (
  & HandlerProvider<Identifier>
  & { readonly payload: Payload }
);
