import { HandlerMiddlewareDefinition, HandlerMiddlewareFunctionParameters, HandlerMiddlewareFunctionResponse, HandlerMiddlewareImplementationWithInvokeFunction } from '../component/middleware';
import { HandlerProvider } from '../component/provider';
import { HandlerResponse, HandlerResponseIdentifier } from '../component/response';
import { HandlerBuilder } from './builder';

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

type MiddlewarePassThrough = HandlerMiddlewareDefinition<Provider, any, any, any, any>;

class WithPassThrough implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewarePassThrough> {
  async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewarePassThrough>): Promise<HandlerMiddlewareFunctionResponse<MiddlewarePassThrough>> {
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

type MiddlewareKnownInputContext = HandlerMiddlewareDefinition<Provider, BaseContext, any, any, any>;

class WithKnownInputContext implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewareKnownInputContext> {
  async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewareKnownInputContext>): Promise<HandlerMiddlewareFunctionResponse<MiddlewareKnownInputContext>> {
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

type MiddlewareContextSubset = HandlerMiddlewareDefinition<Provider, Pick<BaseContext, 'age'>, any, any, any>;

class WithContextSubset implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewareContextSubset> {
  async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewareContextSubset>): Promise<HandlerMiddlewareFunctionResponse<MiddlewareContextSubset>> {
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

type MiddlewareContextAdditional = HandlerMiddlewareDefinition<Provider, Pick<BaseContext, 'age'>, { born: Date }, any, any>;

class WithContextAdditional implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewareContextAdditional> {
  async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewareContextAdditional>): Promise<HandlerMiddlewareFunctionResponse<MiddlewareContextAdditional>> {
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

type MiddlewareContextUsingAdditional = HandlerMiddlewareDefinition<Provider, { born: Date }, any, any, any>;

class WithContextUsingAdditional implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewareContextUsingAdditional> {
  async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewareContextUsingAdditional>): Promise<HandlerMiddlewareFunctionResponse<MiddlewareContextUsingAdditional>> {
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

type MiddlewareResponseAdditional = HandlerMiddlewareDefinition<Provider, any, any, NewResponse, BaseResponse>;

class WithResponseAdditional implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewareResponseAdditional> {
  async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewareResponseAdditional>): Promise<HandlerMiddlewareFunctionResponse<MiddlewareResponseAdditional>> {
    const response = next({
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

type MiddlewareResponseUsage = HandlerMiddlewareDefinition<Provider, { age: number }, any, any, NewResponse>;

class WithResponseUsage implements HandlerMiddlewareImplementationWithInvokeFunction<MiddlewareResponseUsage> {
  async invoke({ next, context }: HandlerMiddlewareFunctionParameters<MiddlewareResponseUsage>): Promise<HandlerMiddlewareFunctionResponse<MiddlewareResponseUsage>> {
    const response = next({
      ...context,
    });

    if (context.age < 18) {
      return {
        type: 'response:new',
        value: {
          message: 'denied, too young',
        }
      }
    }

    return response;
  }
}


const b7 = b6.use(new WithResponseUsage());
