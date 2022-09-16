import type { HandlerResponse, HandlerResponseIdentifier } from '@phasma/handler/src/component/response';

/**
 * A {@link HandlerResponseIdentifier} for the AWS Lambda result response.
 */
export type LambdaHandlerResponseIdentifier = HandlerResponseIdentifier<'aws:result'>;

/**
 * A {@link HandlerResponse} for the AWS Lambda result response.
 */
export type LambdaHandlerResponse<Value> = HandlerResponse<LambdaHandlerResponseIdentifier, Value>;
