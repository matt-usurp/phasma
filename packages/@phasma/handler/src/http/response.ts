import type { Grok } from '@matt-usurp/grok';
import type { HandlerResponse, HandlerResponseGetValue, HandlerResponseIdentifier } from '../component/response';
import { create } from '../response';
import type { HttpResponseHeaderMapping } from './header';

export type HttpResponseTransportWithStatusCode<Value> = { readonly status: Value };
export type HttpResponseTransportWithHeaders<Value> = { readonly headers: Value };
export type HttpResponseTransportWithBody<Value> = { readonly body: Value };

/**
 * A http response transport data structure.
 */
export type HttpResponseTransport<
  StatusCode extends number,
  Body = undefined,
  Headers extends (HttpResponseHeaderMapping | undefined) = (HttpResponseHeaderMapping | undefined),
> = (
  & HttpResponseTransportWithStatusCode<StatusCode>
  & HttpResponseTransportWithHeaders<Headers>
  & HttpResponseTransportWithBody<Body>
);

export type HttpResponseTransportKind = (
/* eslint-disable @typescript-eslint/indent */
  HttpResponseTransport<
    number,
    any, // eslint-disable-line @typescript-eslint/no-explicit-any
    any // eslint-disable-line @typescript-eslint/no-explicit-any
  >
/* eslint-enable @typescript-eslint/indent */
);

export type HttpResponseTransportGetStatus<Transport extends HttpResponseTransportKind> = Transport['status'];
export type HttpResponseTransportGetHeaders<Transport extends HttpResponseTransportKind> = Transport['headers'];
export type HttpResponseTransportGetBody<Transport extends HttpResponseTransportKind> = Transport['body'];

export type HttpResponseTransportWithStringBody = HttpResponseTransport<number, string>;
export type HttpResponseTransportWithObjectBody = HttpResponseTransport<number, Grok.Constraint.ObjectLike>;

export type HttpResponseIdentifer = HandlerResponseIdentifier<'http'>;
export type HttpResponse<Transport extends HttpResponseTransportKind> = HandlerResponse<HttpResponseIdentifer, Transport>;

export type HttpResponseKind = HttpResponse<HttpResponseTransportKind>;

export type HttpFactoryPartialTransport<Transport extends HttpResponseTransportKind> = (
  & HttpResponseTransportWithStatusCode<HttpResponseTransportGetStatus<Transport>>
  & (
  /* eslint-disable @typescript-eslint/indent */
    Grok.If<
      Grok.Or<[
        Grok.Value.IsAny<HttpResponseTransportGetBody<Transport>>,
        Grok.Value.IsUndefined<HttpResponseTransportGetBody<Transport>>,
      ]>,
      Partial<HttpResponseTransportWithBody<HttpResponseTransportGetBody<Transport>>>,
      HttpResponseTransportWithBody<HttpResponseTransportGetBody<Transport>>
    >
  /* eslint-enable @typescript-eslint/indent */
  )
  & (
  /* eslint-disable @typescript-eslint/indent */
    Grok.If<
      Grok.Or<[
        Grok.Value.IsAny<HttpResponseTransportGetHeaders<Transport>>,
        Grok.Value.IsUndefined<HttpResponseTransportGetHeaders<Transport>>,
      ]>,
      Partial<HttpResponseTransportWithHeaders<HttpResponseTransportGetHeaders<Transport>>>,
      HttpResponseTransportWithHeaders<HttpResponseTransportGetHeaders<Transport>>
    >
  /* eslint-enable @typescript-eslint/indent */
  )
);

export function http<Response extends HttpResponseKind>(transport: HttpFactoryPartialTransport<HandlerResponseGetValue<Response>>): Response;
export function http<Transport extends HttpResponseTransportKind>(transport: HttpFactoryPartialTransport<Transport>): HttpResponse<Transport>;
export function http(transport: HttpFactoryPartialTransport<HttpResponseTransportKind>): HttpResponseKind {
  return create<HttpResponseKind>('response:http', {
    status: transport.status,
    headers: transport.headers,
    body: transport.body,
  });
}

export type HttpResponseErrorIdentifier = HandlerResponseIdentifier<'http-error'>;
export type HttpResponseError<Origin extends string, Hint extends string, Errors> = (
/* eslint-disable @typescript-eslint/indent */
  HandlerResponse<
    HttpResponseErrorIdentifier,
    HttpResponseErrorData<Origin, Hint, Errors>
  >
/* eslint-enable @typescript-eslint/indent */
);

export type HttpResponseErrorKind = (
/* eslint-disable @typescript-eslint/indent */
  HttpResponseError<
    any, // eslint-disable-line @typescript-eslint/no-explicit-any
    any, // eslint-disable-line @typescript-eslint/no-explicit-any
    any // eslint-disable-line @typescript-eslint/no-explicit-any
  >
/* eslint-enable @typescript-eslint/indent */
);

export type HttpResponseErrorData<Origin extends string, Hint extends string, Errors> = {
  /**
   * The origin of the error.
   *
   * This is often returned from the API and should direct the user to the error location.
   * The origin will provide context to the errors for debugging.
   */
  readonly origin: Origin;

  /**
   * The error hint, a machine readable string representing the error.
   * This is used for debug purposes or for middleware to anchor on.
   */
  readonly hint: Hint;

  /**
   * The error details.
   */
  readonly errors: Errors;
};

export type HttpResponseErrorDataKind = (
/* eslint-disable @typescript-eslint/indent */
  HttpResponseErrorData<
    string,
    string,
    any // eslint-disable-line @typescript-eslint/no-explicit-any
  >
/* eslint-enable @typescript-eslint/indent */
);

export type HttpResponseErrorDataGetOrigin<Data extends HttpResponseErrorDataKind> = Data['origin'];
export type HttpResponseErrorDataGetHint<Data extends HttpResponseErrorDataKind> = Data['hint'];
export type HttpResponseErrorDataGetErrors<Data extends HttpResponseErrorDataKind> = Data['errors'];

// export function error<Response extends HttpResponseError<string, string, unknown>>(value: HandlerResponseGetValue<Response>): Response;
// export function error<Transport extends HttpResponseTransportKind>(value: Transport): HttpResponse<Transport>;

export function error<Response extends HttpResponseErrorKind>(origin: HttpResponseErrorDataGetOrigin<HandlerResponseGetValue<Response>>, hint: HttpResponseErrorDataGetHint<HandlerResponseGetValue<Response>>, errors?: HttpResponseErrorDataGetErrors<HandlerResponseGetValue<Response>>): Response;
export function error<Data extends HttpResponseErrorDataKind>(origin: HttpResponseErrorDataGetOrigin<Data>, hint: HttpResponseErrorDataGetHint<Data>, errors?: HttpResponseErrorDataGetErrors<Data>): HttpResponseError<HttpResponseErrorDataGetOrigin<Data>, HttpResponseErrorDataGetHint<Data>, HttpResponseErrorDataGetErrors<Data>>;
export function error( origin: HttpResponseErrorDataGetOrigin<HttpResponseErrorDataKind>, hint: HttpResponseErrorDataGetHint<HttpResponseErrorDataKind>, errors?: HttpResponseErrorDataGetErrors<HttpResponseErrorDataKind>): HttpResponseErrorKind {
  return create<HttpResponseErrorKind>('response:http-error', {
    origin,
    hint,
    errors,
  });
}

/**
 * A http response header structure for errors with an {@link Origin} indicating where the error took place.
 */
export type HttpResponseErrorHeaders<Origin extends string, Hint extends string> = {
  'error-origin': Origin;
  'error-hint': Hint;
};

/**
 * The below import(s) and namespace allows this file to compose a better developer experience through type aliasing.
 * Here we define a series of aliases that provide better naming and a single type import.
 * This is then aliased in the root file with a better name also.
 */
import * as response from './response';

/*!
 * This is a developer experience namespace merge.
 * You are probably looking for the defined type instead, keep searching for another result.
 */
export namespace HttpResponse {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Transport = response.HttpResponseTransport;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import AnyTransport = response.HttpResponseTransportKind;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import Error = response.HttpResponseError;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import AnyError = response.HttpResponseErrorKind;
}

/*!
 * This is a developer experience namespace merge.
 * You are probably looking for the defined type instead, keep searching for another result.
 */
export namespace HttpResponseTransport {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import WithStringBody = response.HttpResponseTransportWithStringBody;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export import WithObjectBody = response.HttpResponseTransportWithObjectBody;
}
