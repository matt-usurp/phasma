import type { HandlerProvider, HandlerProviderIdentifier } from '@phasma/handler/src/component/provider';
import type { Context as RawLambdaContext } from 'aws-lambda';
import type { LambdaHandlerEventSourceIdentifiers, LambdaHandlerEventSourcePayloadFromIdentifier } from './event';

export type { RawLambdaContext };

/**
 * A provider identifier for AWS Lambda.
 *
 * @see {@link HandlerProviderIdentifier} for more information.
 */
export type LambdaHandlerProviderIdentifier = HandlerProviderIdentifier<'aws:lambda'>;

export type LambdaHandlerProvider = (
  & HandlerProvider<LambdaHandlerProviderIdentifier>
  & {
    /**
     * The function invocation details.
     */
    readonly function: LambdaHandlerProviderFunctionMeta;

    /**
     * The logging details that are attached to this function invocation.
     */
    readonly logging: LambdaHandlerProviderLoggingMeta;
  }
);

export type LambdaHandlerProviderWithEvent<Event> = (
  & LambdaHandlerProvider
  & {
    /**
     * The event details that were pass to this function invocation.
     *
     * This {@link Event} information is tailored to the specific event payload depending on the event source identifier used.
     * Some invocations might not have an event, in which case this will be `never` or an empty object.
     */
    readonly event: Event;
  }
);

export type LambdaHandlerProviderWithEventFromEventSourceIdentifier<EventSourceIdentifier extends LambdaHandlerEventSourceIdentifiers> = (
  LambdaHandlerProviderWithEvent<LambdaHandlerEventSourcePayloadFromIdentifier<EventSourceIdentifier>>
);

/**
 * @see {@link RawLambdaContext} for more information.
 */
export type LambdaHandlerProviderLoggingMeta = {
  /**
   * The assigned log group name.
   *
   * @see {@link RawLambdaContext.logGroupName} for more information.
   */
  readonly group: string;

  /**
   * The assigned log stream name.
   *
   * @see {@link RawLambdaContext.logStreamName} for more information.
   */
  readonly stream: string;
};

/**
 * @see {@link RawLambdaContext} for more information.
 */
export type LambdaHandlerProviderFunctionMeta = {
  /**
   * The executed function's ARN.
   *
   * @example `arn:aws:lambda:eu-west-2:123456789012:function:my-function-name`
   *
   * @see {@link RawLambdaContext.invokedFunctionArn} for more information.
   */
  readonly arn: string;

  /**
   * The executed function's name.
   *
   * @example `queue-processor`
   * @example `api-handler`
   *
   * @see {@link RawLambdaContext.functionName} for more information.
   */
  readonly name: string;

  /**
   * The executed function's version.
   *
   * @example `$LATEST`
   *
   * @see {@link RawLambdaContext.functionVersion} for more information.
   */
  readonly version: string;

  /**
   * The executed function's allocated memory in MB.
   *
   * @example `512`
   * @example `1024`
   *
   * @see {@link RawLambdaContext.memoryLimitInMB} for more information.
   */
  readonly memory: number;

  /**
   * The amount of time the function has available to complete its task before its terminated.
   * The value returned is the number of milliseconds remaining.
   *
   * @example `3000` (3s)
   * @example `500` (500ms)
   *
   * @see {@link RawLambdaContext.getRemainingTimeInMillis} for more information.
   */
  readonly ttl: () => number;
};
