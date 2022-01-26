import type { LambdaHandlerDefinition } from '@phasma/handler-aws/src/component/handler';
import { aws } from '@phasma/handler-aws/src/index';
import type { HandlerFunctionParameters, HandlerFunctionResponse, HandlerImplementationWithHandleFunction } from '@phasma/handler/src/component/handler';

export type SomeHandlerDefinition = LambdaHandlerDefinition<'apigw:proxy:v2'>;

export class SomeHandlerImplementation implements HandlerImplementationWithHandleFunction<SomeHandlerDefinition> {
  async handle({ provider, context }: HandlerFunctionParameters<SomeHandlerDefinition>): Promise<HandlerFunctionResponse<SomeHandlerDefinition>> {
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
