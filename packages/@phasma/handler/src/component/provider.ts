/**
 * A handler provider identity factory.
 * The given format is used to differentiate between providers and other objects.
 */
export type HandlerProviderIdentifier<Name extends string> = `provider:${Name}`;
export type HandlerProviderIdentifierConstraint = HandlerProviderIdentifier<string>;

export type HandlerProvider<Identifier extends HandlerProviderIdentifierConstraint> = {
  readonly id: Identifier;
};

export type HandlerProviderConstraint = HandlerProvider<any>;

export type HandlerProviderWithPayload<
  Identifier extends HandlerProviderIdentifierConstraint,
  Payload,
> = (
  & HandlerProvider<Identifier>
  & { readonly payload: Payload }
);
