import { Event, Middleware, Provider } from '@phasma/handler-aws/src/index';
import { result } from '@phasma/handler-aws/src/response';

type EventSourceIdentifier = Event.Source<'apigw:proxy:v2'>;

type ContextWithApiKey = {
  readonly api: {
    readonly key: string;
  };
};

type Definition = (
/* eslint-disable @typescript-eslint/indent */
  Middleware.Definition<
    Provider.WithEventSource<EventSourceIdentifier>,
    Middleware.Definition.Inherit.ContextInbound,
    ContextWithApiKey,
    Middleware.Definition.Inherit.ResponseInbound,
    Event.ResultRaw<EventSourceIdentifier>
  >
/* eslint-enable @typescript-eslint/indent */
);

/**
 * This middleware will enforce that the request is sent with the api key headers.
 * When the header is missing the middleware short circuits and responds with an unauthorised response.
 * When the key is present it is provided as context down chain.
 */
export class EnforceApiKeyHeaderMiddleware implements Middleware.Implementation<Definition> {
  /**
   * @inheritdoc
   */
  public async invoke({ provider, context, next }: Middleware.Fn.Parameters<Definition>): Middleware.Fn.Response<Definition> {
    const value = provider.event.headers['x-api-key'];

    if (value === undefined || value.length === 0) {
      return result<Event.Result<EventSourceIdentifier>>({
        statusCode: 401,
      });
    }

    return next({
      ...context,

      api: {
        key: value,
      },
    });
  }
}
