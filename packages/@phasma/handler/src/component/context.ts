/**
 * A base context that is expected from all providers.
 * The minimal information a handler might want.
 */
export type HandlerContextBase = {
  /**
   * Information about the request.
   */
  readonly request: {
    /**
     * A unique identity that represents this request.
     * Some providers might be able to use this for tracing purposes.
     */
    readonly id: string;
  };
};

export type HandlerContextConstraint = Record<string, unknown>;
