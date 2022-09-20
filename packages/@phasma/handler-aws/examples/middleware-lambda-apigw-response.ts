import type { Event, Middleware } from '@phasma/handler-aws/src/index';
import { result, unwrap } from '@phasma/handler-aws/src/response';
import type { HandlerResponse, HandlerResponseIdentifier } from '@phasma/handler/src/component/response';

type EventSourceIdentifier = Event.Identifier<'apigw:proxy:v2'>;
type EventSourceResponse = Event.Response<EventSourceIdentifier>;

type CustomResponseIdentifier = HandlerResponseIdentifier<'custom:unauthorised'>;
type CustomResponse = HandlerResponse<CustomResponseIdentifier, {
  reason: string;
}>;

type Definition = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Middleware.Definition.Any.Provider,
    Middleware.Definition.Any.ContextInbound,
    Middleware.Definition.Any.ContextOutbound,
    CustomResponse,
    EventSourceResponse
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * This middleware will transform a custom response type to be compatible with the Api Gateway response.
 * When the custom response is recieved we transform it as expected.
 * When another response is received we ignore and pass it up chain.
 */
export class TransformCustomResponseMiddleware implements Middleware.Implementation<Definition> {
  /**
   * @inheritdoc
   */
  public async invoke({ context, next }: Middleware.Fn.Input<Definition>): Middleware.Fn.Output<Definition> {
    const value = await next(context);

    // Here we test for our custom type.
    if (value.type === 'response:custom:unauthorised') {
      // The value is wrapped in a response wrapper.
      // We can use the response unwrap function to receive the data from inside.
      const data = unwrap(value);

      // Return a response that is compatible with the gateway.
      return result<Event.ResponseValue<EventSourceIdentifier>>({
        statusCode: 401,

        body: JSON.stringify({
          reason: data.reason,
        }),
      });
    }

    return value;
  }
}
