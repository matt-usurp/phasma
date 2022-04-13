import { create } from '@phasma/handler/src/response';
import type { LambdaHandlerResponse } from './component/response';

export { nothing, unwrap } from '@phasma/handler/src/response';

/**
 * Return an AWS formatted handler result of type {@link T}.
 */
export const result = <T>(value: T): LambdaHandlerResponse<T> => create('response:aws:result', value);
