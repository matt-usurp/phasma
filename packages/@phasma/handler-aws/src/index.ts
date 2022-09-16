/* eslint-disable @typescript-eslint/no-unused-vars */
export { entrypoint as awse, factory as aws, id } from './core/provider';
import { Handler as CoreHandler, Middleware as CoreMiddleware, Response as CoreResponse } from '@phasma/handler/src/index';
import * as event from './component/event';
import * as handler from './component/handler';
import * as provider from './component/provider';

export namespace Event {
  export import Source = event.LambdaHandlerEventSourceIdentifierVerifier;

  export import Payload = event.LambdaHandlerEventSourcePayloadFromIdentifier;

  export import Result = event.LambdaHandlerEventSourceResultFromIdentifier;
  export import ResultRaw = event.LambdaHandlerEventSourceResponseFromIdentifier;
}

export namespace Provider {
  export import Base = provider.LambdaHandlerProvider;

  export import WithEventSource = provider.LambdaHandlerProviderWithEventFromEventSourceIdentifier;
}

export import Response = CoreResponse;

export namespace Handler {
  export import Definition = handler.LambdaHandlerDefinition;
  export import Implementation = CoreHandler.Implementation;

  export namespace Fn {
    export import Input = CoreHandler.Fn.Input;
    export import Output = CoreHandler.Fn.Output;
  }

  export import Context = CoreHandler.Context;

  export namespace Response {
    export import Nothing = CoreHandler.Response.Nothing;
  }
}

export namespace Middleware {
  export import Definition = CoreMiddleware.Definition;
  export import Implementation = CoreMiddleware.Implementation;

  export namespace Fn {
    export import Parameters = CoreMiddleware.Fn.Input;
    export import Response = CoreMiddleware.Fn.Output;
  }
}
