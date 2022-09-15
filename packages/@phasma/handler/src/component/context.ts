import type { Grok } from '@matt-usurp/grok';

/**
 * A context base.
 *
 * This is expected to be implemented by all providers at the least.
 * This is considered the minimal information a handler will required (if any).
 */
export type HandlerContextBase = {
  /**
   * Request information.
   *
   * @deprecated Should not be HTTP based, maybe "invocation"?
   */
  readonly request: {
    /**
     * A unique identity that represents this request.
     * Some providers might be able to use this for tracing purposes.
     */
    readonly id: string;
  };
};

/**
 * A constraint type for kinds of context.
 */
export type HandlerContextConstraint = Grok.Constraint.ObjectLike;
