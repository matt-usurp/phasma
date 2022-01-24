import { HandlerResponseConstraint, HandlerResponsePresetNothing } from './component/response';

/**
 * Create a response of given type {@link T}.
 */
export const create = <T extends HandlerResponseConstraint>(type: T['type'], value: T['value']): T => {
  return {
    type,
    value,
  } as T;
};

/**
 * Return a preset nothing response type.
 */
export const nothing = (): HandlerResponsePresetNothing => create('response:nothing', undefined);
