import * as response from '@phasma/handler-aws/src/response';
import type { LambdaHandlerEventSourceResultFromIdentifier } from './component/event';
import { LambdaHandlerResponse } from './component/response';
import { nothing, result, unwrap } from './response';

describe('response', (): void => {
  it('nothing()', (): void => expect(nothing).toStrictEqual(response.nothing));
  it('unwrap()', (): void => expect(unwrap).toStrictEqual(response.unwrap));

  describe('result()', (): void => {
    it('with given value, returns lambda handler result', (): void => {
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
  });
});
