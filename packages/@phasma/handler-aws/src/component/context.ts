import type { HandlerContextBase } from '@phasma/handler/src/component/context';

export type LambdaHandlerContextBase = (
  & HandlerContextBase
  & {
    /**
     * Lambda function related context.
     */
    readonly function: {
      /**
       * The executed functions arn.
       *
       * @example arn:aws:lambda:eu-west-2:123456789012:function:my-function-name
       */
      readonly arn: string;

      /**
       * The executed functions name.
       *
       * @example queue-processor
       * @example api-handler
       */
      readonly name: string;

      /**
       * The executed functions deployed version.
       *
       * @example $LATEST
       */
      readonly version: string;

      /**
       * The executed functions allocated memory in mb.
       *
       * @example 512
       * @example 1024
       */
      readonly memory: number;

      /**
       * The amount of time the function has available to complete its task before its terminated.
       * The value returned is the number of milliseconds remaining.
       *
       * @example 0
       * @example 3000 (3s)
       * @example 500 (500ms)
       */
      readonly ttl: HandlerContextRemainingTimeToLiveFunction;
    };
  }
);

/**
 * The amount of time the function has available to complete its task before its terminated.
 * The value returned is the number of milliseconds remaining.
 *
 * @example 3000 (3s)
 * @example 500 (500ms)
 */
export type HandlerContextRemainingTimeToLiveFunction = () => number;
