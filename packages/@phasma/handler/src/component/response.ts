/**
 * A template for response identifiers.
 *
 * All response identifiers should be prefixed with `response:`, this enforces uniqueness over other identifiers used in the project.
 * This uses the given {@link Identifier} and constructs a compliant type.
 */
export type HandlerResponseIdentifier<Identifier extends string> = `response:${Identifier}`;

/**
 * A constraint type for {@link HandlerResponseIdentifier}.
 */
export type HandlerResponseIdentifierConstraint = HandlerResponseIdentifier<string>;

/**
 * A response wrapper.
 *
 * This is a discriminated type that allows for different {@link Value} types to be parsed by providers and middleware.
 * This is done by checking against fixed {@link Identifier} strings.
 *
 * Custom responses will typically fix the {@link Identifier} and in some cases fix {@link Value} (or abstract it).
 * This usually depends on the integration with a specific provider, so each provider might provide many custom response types.
 */
export type HandlerResponse<
  Identifier extends HandlerResponseIdentifierConstraint,
  Value,
> = {
  /**
   * The {@link HandlerResponseIdentifier} that discriminates this instance from others.
   */
  readonly type: Identifier;

  /**
   * The {@link Value} belonging to this response.
   */
  readonly value: Value;
};

/**
 * A constraint type for {@link HandlerResponse}.
 */
export type HandlerResponseConstraint = HandlerResponse<HandlerResponseIdentifierConstraint, unknown>;

/**
 * Retrieve the {@link HandlerResponseIdentifier} from {@link Response}.
 */
export type HandlerResponseGetIdentifier<Response extends HandlerResponseConstraint> = Response['type'];

/**
 * Retrieve the value from {@link Response}.
 */
export type HandlerResponseGetValue<Response extends HandlerResponseConstraint> = Response['value'];

/**
 * A preset {@link HandlerResponseIdentifier} for noop (no-operation) responses.
 *
 * See {@link HandlerResponsePresetNothing} for more information.
 */
export type HandlerResponsePresetNothingIdentity = HandlerResponseIdentifier<'nothing'>;

/**
 * A preset {@link HandlerResponse} for noop (no-operation) responses.
 *
 * A no-operation response is syntactically the same as `return` or `return void`.
 * This tells the provider to return its version of nothing what ever that might be.
 * Not all providers support {@link HandlerResponsePresetNothing} and may provide their own tailored versions instead.
 */
export type HandlerResponsePresetNothing = HandlerResponse<HandlerResponsePresetNothingIdentity, undefined>;

/**
 * The below import(s) and namespace allows this file to compose a better developer experience through type aliasing.
 * Here we define a series of aliases that provide better naming and a single type import.
 * This is then aliased in the root file with a better name also.
 */
import * as response from './response';

export namespace HandlerResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Identifier = response.HandlerResponseIdentifier;

  export namespace Get {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Identifier = response.HandlerResponseGetIdentifier;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    export import Value = response.HandlerResponseGetValue;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Nothing = response.HandlerResponsePresetNothing;
}
