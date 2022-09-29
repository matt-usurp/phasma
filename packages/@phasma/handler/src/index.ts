import * as handler from './component/handler';
import * as middleware from './component/middleware';
import * as provider from './component/provider';
import * as response from './component/response';
import * as httpmethod from './http/method';
import * as httpresponse from './http/response';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import Handler = handler.Handler;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import Middleware = middleware.HandlerMiddleware;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import Provider = provider.HandlerProvider;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import Response = response.HandlerResponse;

/**
 * A collection of HTTP utilities and base types.
 */
export namespace Http {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Method = httpmethod.HttpMethod;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Response = httpresponse.HttpResponse;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import AnyResponse = httpresponse.HttpResponseKind;
}
