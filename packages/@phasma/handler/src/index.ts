/* eslint-disable @typescript-eslint/no-unused-vars */
import * as context from './component/context';
import * as handler from './component/handler';
import * as middleware from './component/middleware';
import * as response from './component/response';

export namespace Response {
  export import Unwrapped = response.HandlerResponseUnwrapped;
}

export namespace Handler {
  export import Definition = handler.HandlerDefinition;
  export import Implementation = handler.HandlerImplementationWithHandleFunction;

  export namespace Fn {
    export import Parameters = handler.HandlerFunctionParameters;
    export import Response = handler.HandlerFunctionResponse;
  }

  export import Context = context.HandlerContextBase;

  export namespace Response {
    export import Nothing = response.HandlerResponsePresetNothing;
  }
}

export namespace Middleware {
  export import Definition = middleware.HandlerMiddlewareDefinition;
  export import Implementation = middleware.HandlerMiddlewareImplementationWithInvokeFunction;

  export namespace Fn {
    export import Parameters = middleware.HandlerMiddlewareFunctionParameters;
    export import Response = middleware.HandlerMiddlewareFunctionResponse;
  }
}
