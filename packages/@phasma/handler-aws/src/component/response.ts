import type { HandlerResponse, HandlerResponseIdentifier } from '@phasma/handler/src/component/response';

export type LambdaHandlerResponseIdentifier = HandlerResponseIdentifier<'aws'>;
export type LambdaHandlerResponse<Value> = HandlerResponse<LambdaHandlerResponseIdentifier, Value>;
