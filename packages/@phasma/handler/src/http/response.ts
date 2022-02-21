import type { HandlerResponse, HandlerResponseIdentifier } from '../component/response';
import { create } from '../response';
import type { HttpResponseHeaderMapping } from './header';

export type HttpResponseTransport<
  S extends number,
  B,
  H extends HttpResponseHeaderMapping = HttpResponseHeaderMapping,
> = {
  readonly status: S;
  readonly headers?: H;
  readonly body: B;
};

export type HttpResponseTransportKind = HttpResponseTransport<number, any, any>;

export type HttpResponseIdentifer = HandlerResponseIdentifier<'http'>;
export type HttpResponse<M extends HttpResponseTransportKind = HttpResponseTransportKind> = HandlerResponse<HttpResponseIdentifer, M>;

export const http = <M extends HttpResponseTransportKind>(value: M) => create<HttpResponse<M>>('response:http', value);
