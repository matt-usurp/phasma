import { aws } from '@phasma/handler-aws/src';
import type { LambdaHandlerDefinition } from '@phasma/handler-aws/src/component/handler';
import type { HandlerFunctionParameters, HandlerFunctionResponse, HandlerImplementationWithHandleFunction } from '@phasma/handler/src/component/handler';

export type SomeHandler = LambdaHandlerDefinition<'apigw:proxy:v2'>;

export class SomeHandlerImplementation implements HandlerImplementationWithHandleFunction<SomeHandler> {
  async handle({ provider, context }: HandlerFunctionParameters<SomeHandler>): Promise<HandlerFunctionResponse<SomeHandler>> {
    provider.id;
    provider.payload.headers;

    context.request.id;

    throw undefined;
  }
}

export const target = aws<'apigw:proxy:v2'>((lambda) => (
  lambda.handle(new SomeHandlerImplementation())
));

// target(
//   {} // as require('aws-lambda').APIGatewayProxyEventV2,
//   {} // as require('aws-lambda').Context,
// );
