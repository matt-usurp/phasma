import type { Grok } from '@matt-usurp/grok';

/**
 * A context base.
 *
 * This is expected to be implemented by all providers at the least.
 * This is considered the minimal information a handler will required (if any).
 */
export type HandlerContextBase = {
  /**
   * The invocation id, this is a unique identity that is assigned by a provider.
   * If a provider has one it will be used, otherwise this should fallback to a uuid.
   */
  readonly id: string;
};

/**
 * A constraint type for kinds of context.
 */
export type HandlerContextConstraint = Grok.Constraint.ObjectLike;
