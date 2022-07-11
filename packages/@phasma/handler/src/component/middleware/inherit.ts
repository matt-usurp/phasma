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
 * A type that represents possible context values that should be bubbled up the call stack.
 *
 * @todo docs
 */
export type HandlerMiddlewareContextPassThrough = {
  readonly [HandlerInheritMarker]: typeof HandlerInheritSomeContext;
};

/**
 * A type that represents possible return values that should be bubbled down the call stack.
 *
 * @todo docs
 */
export type HandlerMiddlewareResponsePassThrough = (
  & { readonly [HandlerInheritMarker]: typeof HandlerInheritSomeResponse }
  & HandlerResponse<HandlerResponseIdentifier<'@inherit'>, never>
);
