import type { HandlerClassImplementation, HandlerDefinition, HandlerFunctionOutputFromDefinition } from '../component/handler';
import type { HandlerMiddlewareClassImplementation, HandlerMiddlewareDefinition, HandlerMiddlewareFunctionInputFromDefinition, HandlerMiddlewareFunctionOutputFromDefinition } from '../component/middleware';
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
    HandlerMiddlewareDefinition.Inherit.Provider,
    HandlerMiddlewareDefinition.Inherit.ContextOutbound,
    HandlerMiddlewareDefinition.Inherit.ResponseInbound,
    HandlerMiddlewareDefinition.Inherit.ResponseOutbound
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithPassThrough implements HandlerMiddlewareClassImplementation<MiddlewarePassThrough> {
  /**
   * @inheritdoc
   */
  public async invoke({ next, context }: HandlerMiddlewareFunctionInputFromDefinition<MiddlewarePassThrough>): HandlerMiddlewareFunctionOutputFromDefinition<MiddlewarePassThrough> {
    const response = next(context);

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
    HandlerMiddlewareDefinition.Inherit.ContextOutbound,
    HandlerMiddlewareDefinition.Inherit.ResponseInbound,
    HandlerMiddlewareDefinition.Inherit.ResponseOutbound
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithKnownInputContext implements HandlerMiddlewareClassImplementation<MiddlewareKnownInputContext> {
  /**
   * @inheritdoc
   */
  public async invoke({ next, context }: HandlerMiddlewareFunctionInputFromDefinition<MiddlewareKnownInputContext>): HandlerMiddlewareFunctionOutputFromDefinition<MiddlewareKnownInputContext> {
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
    HandlerMiddlewareDefinition.Inherit.ContextOutbound,
    HandlerMiddlewareDefinition.Inherit.ResponseInbound,
    HandlerMiddlewareDefinition.Inherit.ResponseOutbound
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithContextSubset implements HandlerMiddlewareClassImplementation<MiddlewareContextSubset> {
  /**
   * @inheritdoc
   */
  public async invoke({ next, context }: HandlerMiddlewareFunctionInputFromDefinition<MiddlewareContextSubset>): HandlerMiddlewareFunctionOutputFromDefinition<MiddlewareContextSubset> {
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
    HandlerMiddlewareDefinition.Inherit.ResponseInbound,
    HandlerMiddlewareDefinition.Inherit.ResponseOutbound
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithContextAdditional implements HandlerMiddlewareClassImplementation<MiddlewareContextAdditional> {
  /**
   * @inheritdoc
   */
  public async invoke({ next, context }: HandlerMiddlewareFunctionInputFromDefinition<MiddlewareContextAdditional>): HandlerMiddlewareFunctionOutputFromDefinition<MiddlewareContextAdditional> {
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
    HandlerMiddlewareDefinition.Inherit.ContextOutbound,
    HandlerMiddlewareDefinition.Inherit.ResponseInbound,
    HandlerMiddlewareDefinition.Inherit.ResponseOutbound
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithContextUsingAdditional implements HandlerMiddlewareClassImplementation<MiddlewareContextUsingAdditional> {
  /**
   * @inheritdoc
   */
  public async invoke({ next, context }: HandlerMiddlewareFunctionInputFromDefinition<MiddlewareContextUsingAdditional>): HandlerMiddlewareFunctionOutputFromDefinition<MiddlewareContextUsingAdditional> {
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
    HandlerMiddlewareDefinition.Inherit.Provider,
    HandlerMiddlewareDefinition.Inherit.ContextOutbound,
    NewResponse,
    BaseResponse
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithResponseAdditional implements HandlerMiddlewareClassImplementation<MiddlewareResponseAdditional> {
  /**
   * @inheritdoc
   */
  public async invoke({ next, context }: HandlerMiddlewareFunctionInputFromDefinition<MiddlewareResponseAdditional>): HandlerMiddlewareFunctionOutputFromDefinition<MiddlewareResponseAdditional> {
    const response = await next(context);

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
    HandlerMiddlewareDefinition.Inherit.ContextOutbound,
    HandlerMiddlewareDefinition.Inherit.ResponseInbound,
    NewResponse
  >
/* eslint-enable @typescript-eslint/indent */
);

class WithResponseUsage implements HandlerMiddlewareClassImplementation<MiddlewareResponseUsage> {
  /**
   * @inheritdoc
   */
  public async invoke({ next, context }: HandlerMiddlewareFunctionInputFromDefinition<MiddlewareResponseUsage>): HandlerMiddlewareFunctionOutputFromDefinition<MiddlewareResponseUsage> {
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
    HandlerDefinition.Inherit.Provider,
    { age: number },
    NewResponse
  >
/* eslint-enable @typescript-eslint/indent */
);

class ExampleHandler implements HandlerClassImplementation<ExampleHandlerDefinition> {
  /**
   * @inheritdoc
   */
  public async handle(): HandlerFunctionOutputFromDefinition<ExampleHandlerDefinition> {
    throw 123; // w/e
  }
}

b7.handle(new ExampleHandler());
