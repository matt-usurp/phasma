import type { HandlerResponseConstraint, HandlerResponseGetIdentifier, HandlerResponseGetValue, HandlerResponsePresetNothing } from './component/response';

/**
 * Unwrap the {@link Response} and return its contained value.
 */
export const unwrap = <Response extends HandlerResponseConstraint>(response: Response): HandlerResponseGetValue<Response> => response.value;

/**
 * Create {@link Response} with its type and value.
 */
export const create = <Response extends HandlerResponseConstraint>(type: HandlerResponseGetIdentifier<Response>, value: HandlerResponseGetValue<Response>): Response => {
  return {
    type,
    value,
  } as Response;
};

/**
 * Return a {@link HandlerResponsePresetNothing} instance.
 */
export const nothing = (): HandlerResponsePresetNothing => create('response:nothing', undefined);
