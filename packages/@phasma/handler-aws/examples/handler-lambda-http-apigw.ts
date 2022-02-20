import type { LambdaHandlerDefinition } from '@phasma/handler-aws/src/component/handler';
import { aws } from '@phasma/handler-aws/src/index';
import { HandlerContextBase } from '@phasma/handler/src/component/context';
import type { HandlerFunctionResponse, HandlerImplementationWithHandleFunction } from '@phasma/handler/src/component/handler';
import { http, HttpResponse } from '@phasma/handler/src/http/response';
import { HttpTransformerMiddleware } from '../src/http/middlware/http-transformer';

export type ExampleHandlerDefinition = LambdaHandlerDefinition<'apigw:proxy:v2', HandlerContextBase, HttpResponse>;

export class ExampleHandler implements HandlerImplementationWithHandleFunction<ExampleHandlerDefinition> {
  async handle(): Promise<HandlerFunctionResponse<ExampleHandlerDefinition>> {
    return http({
      status: 200,
      body: undefined,
    })
  }
}

export const target = aws<'apigw:proxy:v2'>((lambda) => (
  lambda
    .use(new HttpTransformerMiddleware())
    .handle(new ExampleHandler())
));

// target(
//   {} // as require('aws-lambda').APIGatewayProxyEventV2,
//   {} // as require('aws-lambda').Context,
// );
