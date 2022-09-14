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
  export import Implementation = handler.HandlerClassImplementation;

  export namespace Fn {
    export import Input = handler.HandlerFunctionInputFromDefinition;
    export import Output = handler.HandlerFunctionOutputFromDefinition;

    export import Parameters = handler.HandlerFunctionInputFromDefinition;
    export import Response = handler.HandlerFunctionOutputFromDefinition;
  }

  export import Context = context.HandlerContextBase;

  export namespace Response {
    export import Nothing = response.HandlerResponsePresetNothing;
  }
}

export namespace Middleware {
  export import Definition = middleware.HandlerMiddlewareDefinition;
  export import Implementation = middleware.HandlerMiddlewareClassImplementation;

  export namespace Fn {
    export import Input = middleware.HandlerMiddlewareFunctionInputFromDefinition;
    export import Output = middleware.HandlerMiddlewareFunctionOutputFromDefinition;

    export import Parameters = middleware.HandlerMiddlewareFunctionInputFromDefinition;
    export import Response = middleware.HandlerMiddlewareFunctionOutputFromDefinition;
  }
}
