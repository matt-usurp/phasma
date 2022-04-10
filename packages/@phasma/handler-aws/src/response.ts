import { create } from '@phasma/handler/src/response';
import { LambdaHandlerResponse } from './component/response';

export {
  nothing,
  unwrap
} from '@phasma/handler/src/response';


/**
 * Return an AWS formated handler result.
 */
export const result = <T>(value: T): LambdaHandlerResponse<T> => create('response:aws:result', value);
