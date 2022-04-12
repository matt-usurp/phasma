/**
 * A handler response identity factory.
 *
 * The given format is used to differentiate between responses and other objects.
 */
export type HandlerResponseIdentifier<Name extends string> = `response:${Name}`;
export type HandlerResponseIdentifierConstraint = HandlerResponseIdentifier<string>;

/**
 * A handler response.
 *
 * The payload contains an identifier and its value.
 * This is used within providers and middleware to handle its own response.
 */
export type HandlerResponse<
  Identifier extends HandlerResponseIdentifierConstraint,
  Value,
> = {
  readonly type: Identifier;
  readonly value: Value;
};

/**
 * A utility type to retreive the value of a given handler response type.
 */
export type HandlerResponseUnwrapped<T extends HandlerResponseConstraint> = T['value'];

export type HandlerResponseConstraint = HandlerResponse<HandlerResponseIdentifierConstraint, unknown>;

export type HandlerResponsePresetNothingIdentity = HandlerResponseIdentifier<'nothing'>;
export type HandlerResponsePresetNothing = HandlerResponse<HandlerResponsePresetNothingIdentity, undefined>;
