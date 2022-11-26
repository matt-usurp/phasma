import { HandlerResponse, HandlerResponseIdentifier } from '../response';

/**
 * A marker symbol that is used for types alone.
 *
 * This indicates the type represents a value that is not known at this point.
 * Therefore we move the types along in case other middleware or handlers require them.
 *
 * This is essentially a type means of doing a deep merge in some cases.
 */
const HandlerInheritMarker = Symbol();
const HandlerInheritSomeContext = Symbol();
const HandlerInheritSomeResponse = Symbol();

/**
 * A type that represents unknown (but possible) context values that might be required further down the stack.
 *
 * The purpose of this type is to enforce the merging of context.
 * Please ensure your context is applied on top of this.
 */
export type HandlerMiddlewareContextPassThrough = {
  readonly [HandlerInheritMarker]: typeof HandlerInheritSomeContext;
};

/**
 * A type that represents unknown (but possible) responses that might be transformable up the stack.
 *
 * The purpose of this type is to enforce that you test out the responses you are concerned with, and that others are returned.
 * Please ensure you only test out your responses.
 */
export type HandlerMiddlewareResponsePassThrough = (
  & { readonly [HandlerInheritMarker]: typeof HandlerInheritSomeResponse }
  & HandlerResponse<HandlerResponseIdentifier<'@inherit'>, never>
);
