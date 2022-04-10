import { http, HttpResponse, HttpResponseTransport, HttpResponseTransportKind } from './response';

type TestOkayResponse = HttpResponseTransport<200, {
  name: string;
  age: number;
}>;

type TestBodylessResponse = HttpResponseTransport<201, undefined>;

describe('http()', (): void => {
  it('with given transport, creates http response', (): void => {
    expect(
      http<TestOkayResponse>({
        status: 200,
        body: {
          name: 'fanta',
          age: 30,
        },
      }),
    ).toStrictEqual<HttpResponse<HttpResponseTransportKind>>({
      type: 'response:http',
      value: {
        status: 200,
        body: {
          name: 'fanta',
          age: 30,
        },
      },
    });
  });

  it('with given transport, undefined body, creates http response', (): void => {
    expect(
      http<TestBodylessResponse>({
        status: 201,
        body: undefined,
      }),
    ).toStrictEqual<HttpResponse<TestBodylessResponse>>({
      type: 'response:http',
      value: {
        status: 201,
        body: undefined,
      },
    });
  });
});
