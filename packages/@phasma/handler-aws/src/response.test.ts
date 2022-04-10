import * as response from '@phasma/handler-aws/src/response';
import type { LambdaHandlerEventSourceResultFromIdentifier } from './component/event';
import type { LambdaHandlerResponse } from './component/response';
import { nothing, result, unwrap } from './response';

describe('nothing()', (): void => {
  it('is forwarded export', (): void => expect(nothing).toStrictEqual(response.nothing));
});

describe('unwrap()', (): void => {
  it('is forwarded export', (): void => expect(unwrap).toStrictEqual(response.unwrap));
});

describe('result()', (): void => {
  it('with given value, returns lambda handler result, api gateway', (): void => {
    type R = LambdaHandlerEventSourceResultFromIdentifier<'apigw:proxy:v2'>;

    expect(
      result<R>({
        isBase64Encoded: false,
        statusCode: 301,
        body: 'Hello',
      }),
    ).toStrictEqual<LambdaHandlerResponse<R>>({
      type: 'response:aws:result',
      value: {
        isBase64Encoded: false,
        statusCode: 301,
        body: 'Hello',
      },
    });
  });

  it('with given value, returns lambda handler result, lex', (): void => {
    type R = LambdaHandlerEventSourceResultFromIdentifier<'lex'>;

    expect(
      result<R>({
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Failed',
        },
      }),
    ).toStrictEqual<LambdaHandlerResponse<R>>({
      type: 'response:aws:result',
      value: {
        dialogAction: {
          type: 'Close',
          fulfillmentState: 'Failed',
        },
      },
    });
  });
});
