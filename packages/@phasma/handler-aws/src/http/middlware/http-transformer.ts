import { HandlerMiddlewareDefinition, HandlerMiddlewareFunctionParameters, HandlerMiddlewareFunctionResponse, HandlerMiddlewareImplementationWithInvokeFunction } from '@phasma/handler/src/component/middleware';
import { HttpResponse, HttpResponseTransport, HttpResponseTransportKind } from '@phasma/handler/src/http/response';
import { create } from '@phasma/handler/src/response';
import { LambdaHandlerEventSourceFromIdentifier } from '../../component/event';

type ProxyResponse = LambdaHandlerEventSourceFromIdentifier<'apigw:proxy:v2'>['EventSourceResponse'];

export type HttpTransformerProxyResponseTransport = HttpResponseTransport<number, Record<string, string | number>, string>;

export type HttpTransformerMiddlewareDefinition<R extends HttpResponseTransportKind> = (
  HandlerMiddlewareDefinition<
    HandlerMiddlewareDefinition.SomeProvider,
    HandlerMiddlewareDefinition.SomeContextInbound,
    HandlerMiddlewareDefinition.SomeContextOutbound,
    HttpResponse<R>,
    ProxyResponse
  >
);

export class HttpTransformerMiddleware<R extends HttpTransformerProxyResponseTransport> implements HandlerMiddlewareImplementationWithInvokeFunction<HttpTransformerMiddlewareDefinition<R>> {
  public async invoke({ context, next }: HandlerMiddlewareFunctionParameters<HttpTransformerMiddlewareDefinition<R>>): Promise<HandlerMiddlewareFunctionResponse<HttpTransformerMiddlewareDefinition<R>>> {
    const result = await next(context);

    if (result.type === 'response:http') {
      return create<ProxyResponse>('response:aws', {
        statusCode: result.value.status,
        headers: result.value.headers ?? {},
        body: result.value.body ?? '',
      });
    }

    return result;
  }
}
