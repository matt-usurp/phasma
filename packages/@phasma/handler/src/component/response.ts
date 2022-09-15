import * as self from './response';

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

export namespace HandlerResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Identifier = self.HandlerResponseIdentifier;

  /**
   * Retrieve data from the {@link HandlerResponse}.
   */
  export namespace Get {
    /**
     * Retrieve the {@link HandlerResponseIdentifier} from {@link Response}.
     */
    export type Identifier<Response extends HandlerResponseConstraint> = Response['type'];

    /**
     * Retrieve the value from {@link Response}.
     */
    export type Value<Response extends HandlerResponseConstraint> = Response['value'];
  }
}

/**
 * A constraint type for {@link HandlerResponse}.
 */
export type HandlerResponseConstraint = HandlerResponse<HandlerResponseIdentifierConstraint, unknown>;

/**
 * A utility type to retreive the value of a given handler response type.
 *
 * @deprecated use `HandlerResponse.Get.Value` instead, to be removed in `>=1.1.0`
 */
export type HandlerResponseUnwrapped<Response extends HandlerResponseConstraint> = Response['value'];

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
