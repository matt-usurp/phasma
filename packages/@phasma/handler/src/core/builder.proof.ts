import type { HandlerDefinition, HandlerFunctionResponse, HandlerImplementationWithHandleFunction } from '../component/handler';
import type { HandlerMiddlewareDefinition, HandlerMiddlewareFunctionParameters, HandlerMiddlewareFunctionResponse, HandlerMiddlewareImplementationWithInvokeFunction } from '../component/middleware';
import type { HandlerProvider } from '../component/provider';
import type { HandlerResponse, HandlerResponseIdentifier } from '../component/response';
import type { HandlerBuilder } from './builder';

type Provider = HandlerProvider<'provider:example'>;

/**
 * For test purposes, a base context that we will mutate downstream.
 */
type BaseContext = {
  readonly name: string;
  readonly age: number;
};

/**
 * For test purposes, an example tailored response expected as the final output.
 */
type BaseResponse = HandlerResponse<HandlerResponseIdentifier<'base'>, {
  ok: boolean;
}>;

declare const b0: HandlerBuilder<Provider, BaseContext, BaseResponse>;

// --
// --
// --

type MiddlewarePassThrough = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareDefinition<
    Provider,
    HandlerMiddlewareDefinition.SomeContextInbound,
    HandlerMiddlewareDefinition.SomeContextOutbound,
    HandlerMiddlewareDefinition.SomeResponseInbound,
    HandlerMiddlewareDefinition.SomeResponseOutbound
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithPassThrough implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewarePassThrough> {
  public async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewarePassThrough>): HandlerMiddlewareFunctionResponse<MiddlewarePassThrough> {
    const response = next({
      ...context,
    });

    return response;
  }
}

const b1 = b0.use(new WithPassThrough());

// --
// --
// --

type MiddlewareKnownInputContext = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareDefinition<
    Provider,
    BaseContext,
    HandlerMiddlewareDefinition.SomeContextOutbound,
    HandlerMiddlewareDefinition.SomeResponseInbound,
    HandlerMiddlewareDefinition.SomeResponseOutbound
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithKnownInputContext implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewareKnownInputContext> {
  public async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewareKnownInputContext>): HandlerMiddlewareFunctionResponse<MiddlewareKnownInputContext> {
    const response = next({
      ...context,
    });

    return response;
  }
}

const b2 = b1.use(new WithKnownInputContext());

// --
// --
// --

type MiddlewareContextSubset = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareDefinition<
    Provider,
    Pick<BaseContext, 'age'>,
    HandlerMiddlewareDefinition.SomeContextOutbound,
    HandlerMiddlewareDefinition.SomeResponseInbound,
    HandlerMiddlewareDefinition.SomeResponseOutbound
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithContextSubset implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewareContextSubset> {
  public async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewareContextSubset>): HandlerMiddlewareFunctionResponse<MiddlewareContextSubset> {
    const response = next({
      ...context,
    });

    return response;
  }
}


const b3 = b2.use(new WithContextSubset());

// --
// --
// --

type MiddlewareContextAdditional = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareDefinition<
    Provider,
    Pick<BaseContext, 'age'>,
    { born: Date },
    HandlerMiddlewareDefinition.SomeResponseInbound,
    HandlerMiddlewareDefinition.SomeResponseOutbound
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithContextAdditional implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewareContextAdditional> {
  public async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewareContextAdditional>): HandlerMiddlewareFunctionResponse<MiddlewareContextAdditional> {
    const response = next({
      ...context,

      born: new Date(),
    });

    return response;
  }
}


const b4 = b3.use(new WithContextAdditional());

// --
// --
// --

type MiddlewareContextUsingAdditional = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareDefinition<
    Provider,
    { born: Date },
    HandlerMiddlewareDefinition.SomeContextOutbound,
    HandlerMiddlewareDefinition.SomeResponseInbound,
    HandlerMiddlewareDefinition.SomeResponseOutbound
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithContextUsingAdditional implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewareContextUsingAdditional> {
  public async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewareContextUsingAdditional>): HandlerMiddlewareFunctionResponse<MiddlewareContextUsingAdditional> {
    const response = next({
      ...context,
    });

    return response;
  }
}


const b5 = b4.use(new WithContextUsingAdditional());

// --
// --
// --

type NewResponse = HandlerResponse<HandlerResponseIdentifier<'new'>, {
  message: unknown;
}>;

type MiddlewareResponseAdditional = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareDefinition<
    Provider,
    HandlerMiddlewareDefinition.SomeContextInbound,
    HandlerMiddlewareDefinition.SomeContextOutbound,
    NewResponse,
    BaseResponse
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithResponseAdditional implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewareResponseAdditional> {
  public async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewareResponseAdditional>): HandlerMiddlewareFunctionResponse<MiddlewareResponseAdditional> {
    const response = await next({
      ...context,
    });

    if (response.type === 'response:new') {
      return {} as BaseResponse;
    }

    return response;
  }
}


const b6 = b5.use(new WithResponseAdditional());

// --
// --
// --

type MiddlewareResponseUsage = (
/* eslint-disable @typescript-eslint/indent */
  HandlerMiddlewareDefinition<
    Provider,
    { age: number },
    HandlerMiddlewareDefinition.SomeContextOutbound,
    HandlerMiddlewareDefinition.SomeResponseInbound,
    NewResponse
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithResponseUsage implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewareResponseUsage> {
  public async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewareResponseUsage>): HandlerMiddlewareFunctionResponse<MiddlewareResponseUsage> {
    const response = await next({
      ...context,
    });

    if (context.age < 18) {
      return {
        type: 'response:new',
        value: {
          message: 'denied, too young',
        },
      };
    }

    return response;
  }
}


const b7 = b6.use(new WithResponseUsage());

// --
// --
// --

type ExampleHandlerDefinition = (
/* eslint-disable @typescript-eslint/indent */
  HandlerDefinition<
    HandlerDefinition.SomeProvider,
    { age: number },
    NewResponse
  >
/* eslint-enable @typescript-eslint/indent */
);

class ExampleHandler implements HandlerImplementationWithHandleFunction<ExampleHandlerDefinition> {
  public async handle(): HandlerFunctionResponse<ExampleHandlerDefinition> {
    throw 123; // w/e
  }
}

b7.handle(new ExampleHandler());
