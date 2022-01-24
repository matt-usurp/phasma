import { HandlerResponse, HandlerResponseIdentifier } from '../response';

/**
 * A marker symbol that is used for types alone.
 *
 * This indicates the type represents a value that is not known at this point.
 * Therefore we move the types along in case other middleware or handlers require them.
 *
 * This is essentially a type means of doing a deep merge in some cases.
 */
/* istanbul ignore next */ const HandlerInheritMarker = Symbol();

/* istanbul ignore next */ const HandlerInheritSomeContext = Symbol();

/* istanbul ignore next */ const HandlerInheritSomeResponse = Symbol();

export type HandlerMiddlewareValueInheritContext = {
  readonly [HandlerInheritMarker]: typeof HandlerInheritSomeContext;
};

export type HandlerMiddlewareValueInheritResponse = (
  & { readonly [HandlerInheritMarker]: typeof HandlerInheritSomeResponse }
  & HandlerResponse<HandlerResponseIdentifier<'@inherit'>, never>
);
