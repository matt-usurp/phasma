import type { HandlerMiddlewareDefinition, HandlerMiddlewareFunctionParameters, HandlerMiddlewareFunctionResponse, HandlerMiddlewareImplementationWithInvokeFunction } from '@phasma/handler/src/component/middleware';
import type { HttpResponse, HttpResponseTransport } from '@phasma/handler/src/http/response';
import { create } from '@phasma/handler/src/response';
import type { LambdaHandlerEventSourceFromIdentifier } from '../../component/event';

export type HttpResponseLambdaProxy = LambdaHandlerEventSourceFromIdentifier<'apigw:proxy:v2'>['EventSourceResponse'];

export type HttpEncodedTransport = HttpResponseTransport<number, string>;

export type HttpTransformerMiddlewareDefinition<R extends HttpEncodedTransport> = (
  HandlerMiddlewareDefinition<
    HandlerMiddlewareDefinition.SomeProvider,
    HandlerMiddlewareDefinition.SomeContextInbound,
    HandlerMiddlewareDefinition.SomeContextOutbound,
    HttpResponse<R>,
    HttpResponseLambdaProxy
  >
);

export class HttpTransformerMiddleware<R extends HttpEncodedTransport> implements HandlerMiddlewareImplementationWithInvokeFunction<HttpTransformerMiddlewareDefinition<R>> {
  public async invoke({ context, next }: HandlerMiddlewareFunctionParameters<HttpTransformerMiddlewareDefinition<R>>): Promise<HandlerMiddlewareFunctionResponse<HttpTransformerMiddlewareDefinition<R>>> {
    const result = await next(context);

    if (result.type === 'response:http') {
      return create<HttpResponseLambdaProxy>('response:aws', {
        statusCode: result.value.status,
        headers: result.value.headers ?? {},
        body: result.value.body,
      });
    }

    return result;
  }
}
