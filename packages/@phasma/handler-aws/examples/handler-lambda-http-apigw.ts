import type { LambdaHandlerDefinition } from '@phasma/handler-aws/src/component/handler';
import { aws } from '@phasma/handler-aws/src/index';
import type { HandlerContextBase } from '@phasma/handler/src/component/context';
import type { HandlerFunctionResponse, HandlerImplementationWithHandleFunction } from '@phasma/handler/src/component/handler';
import { json } from '@phasma/handler/src/http/body';
import { http, HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';
import { HttpBodyTransformerMiddleware } from '../src/http/middlware/http-body-transformer';
import { HttpTransformerMiddleware } from '../src/http/middlware/http-transformer';

export type ExampleHandlerResponse = HttpResponseTransport<200, {
  name: string;
}>;

export type ExampleHandlerDefinition = LambdaHandlerDefinition<'apigw:proxy:v2', HandlerContextBase, HttpResponse<ExampleHandlerResponse>>;

export class ExampleHandler implements HandlerImplementationWithHandleFunction<ExampleHandlerDefinition> {
  async handle(): Promise<HandlerFunctionResponse<ExampleHandlerDefinition>> {
    return http<ExampleHandlerResponse>({
      status: 200,
      body: {
        name: 'bob',
      },
    })
  }
}

export const target = aws<'apigw:proxy:v2'>((lambda) => (
  lambda
    .use(new HttpTransformerMiddleware())
    .use(new HttpBodyTransformerMiddleware(json))
    .handle(new ExampleHandler())
));

// target(
//   {} // as require('aws-lambda').APIGatewayProxyEventV2,
//   {} // as require('aws-lambda').Context,
// );
