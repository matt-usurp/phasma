import { Grok } from '@matt-usurp/grok';
import { z, ZodBoolean, ZodIssue, ZodNumber, ZodObject, ZodString } from 'zod';
import type { HttpValidatorFunctionResult } from '../validator';
import { FromType, validate } from './zod';

describe('validate()', (): void => {
  it('with schema, simple string, valid, return string', (): void => {
    const schema = z.string();

    const parsed = validate(schema)('something');

    expect(parsed).toStrictEqual<HttpValidatorFunctionResult.ValidatorSuccess<string>>({
      success: true,
      data: 'something',
    });
  });

  it('with schema, object, valid, return object', (): void => {
    const schema = z.object({
      name: z.string(),
      age: z.number(),
    });

    const parsed = validate(schema)({
      name: 'foobar',
      age: 300,
    });

    expect(parsed).toStrictEqual<HttpValidatorFunctionResult.ValidatorSuccess<unknown>>({
      success: true,
      data: {
        name: 'foobar',
        age: 300,
      },
    });
  });

  it('with schema, string, given number, return error', (): void => {
    const schema = z.string();

    const parsed = validate(schema)(123 as unknown as string);

    expect(parsed).toStrictEqual<HttpValidatorFunctionResult.ValidatorFailure<ZodIssue[]>>({
      success: false,
      errors: [
        expect.objectContaining({
          code: 'invalid_type',
        }),
      ],
    });
  });

  it('with schema, object, given invalid properties, return error', (): void => {
    const schema = z.object({
      name: z.string().nonempty(),
      age: z.number().max(30),
    });

    const parsed = validate(schema)({
      name: '',
      age: 31,
    });

    expect(parsed).toStrictEqual<HttpValidatorFunctionResult.ValidatorFailure<ZodIssue[]>>({
      success: false,
      errors: [
        expect.objectContaining({
          code: 'too_small',
          path: ['name'],
        }),
        expect.objectContaining({
          code: 'too_big',
          path: ['age'],
        }),
      ],
    });
  });
});

/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * @internal {@link FromType}
 */
export namespace Test_FromType {
  /**
   * @internal {@link FromType}
   */
  export namespace Test_FromType_OnlyString {
    type Value = FromType<string>;

    type ValueType = ZodString;

    const implementation = z.string();

    type ValueTypeOf = typeof implementation;

    type Case_WithType = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueType>>;
    type Case_WithImplementation = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueTypeOf, Value>>;
    type Case_WithImplementationType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueTypeOf, ValueType>>;

    const assertion: Value = implementation;
  }

  /**
   * @internal {@link FromType}
   */
  export namespace Test_FromType_OnlyNumber {
    type Value = FromType<number>;

    type ValueType = ZodNumber;

    const implementation = z.number();

    type ValueTypeOf = typeof implementation;

    type Case_WithType = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueType>>;
    type Case_WithImplementation = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueTypeOf, Value>>;
    type Case_WithImplementationType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueTypeOf, ValueType>>;

    const assertion: Value = implementation;
  }

  /**
   * @internal {@link FromType}
   */
  export namespace Test_FromType_OnlyBoolean {
    type Value = FromType<boolean>;

    type ValueType = ZodBoolean;

    const implementation = z.boolean();

    type ValueTypeOf = typeof implementation;

    type Case_WithType = Grok.Assert.IsTrue<Grok.Value.IsExactly<Value, ValueType>>;
    type Case_WithImplementation = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueTypeOf, Value>>;
    type Case_WithImplementationType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueTypeOf, ValueType>>;

    const assertion: Value = implementation;
  }

  /**
   * @internal {@link FromType}
   */
  export namespace Test_FromType_ObjectWithString {
    type Value = FromType<{
      value: string;
    }>;

    type ValueType = ZodObject<{
      value: ZodString;
    }>;

    const implementation = z.object<Value>({
      value: z.string(),
    });

    type ValueTypeOf = typeof implementation;

    type Case_WithType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ZodObject<Value>, ValueType>>;
    type Case_WithImplementation = Grok.Assert.IsTrue<Grok.Value.IsExactly<ZodObject<Value>, ValueTypeOf>>;
    type Case_WithImplementationType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueTypeOf, ValueType>>;

    const assertion: ZodObject<Value> = implementation;
  }

  /**
   * @internal {@link FromType}
   */
  export namespace Test_FromType_ObjectWithNumber {
    type Value = FromType<{
      value: number;
    }>;

    type ValueType = ZodObject<{
      value: ZodNumber;
    }>;

    const implementation = z.object<Value>({
      value: z.number(),
    });

    type ValueTypeOf = typeof implementation;

    type Case_WithType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ZodObject<Value>, ValueType>>;
    type Case_WithImplementation = Grok.Assert.IsTrue<Grok.Value.IsExactly<ZodObject<Value>, ValueTypeOf>>;
    type Case_WithImplementationType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueTypeOf, ValueType>>;

    const assertion: ZodObject<Value> = implementation;
  }

  /**
   * @internal {@link FromType}
   */
  export namespace Test_FromType_ObjectWithBoolean {
    type Value = FromType<{
      value: boolean;
    }>;

    type ValueType = ZodObject<{
      value: ZodBoolean;
    }>;

    const implementation = z.object<Value>({
      value: z.boolean(),
    });

    type ValueTypeOf = typeof implementation;

    type Case_WithType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ZodObject<Value>, ValueType>>;
    type Case_WithImplementation = Grok.Assert.IsTrue<Grok.Value.IsExactly<ZodObject<Value>, ValueTypeOf>>;
    type Case_WithImplementationType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueTypeOf, ValueType>>;

    const assertion: ZodObject<Value> = implementation;
  }

  /**
   * @internal {@link FromType}
   */
  export namespace Test_FromType_ObjectWithScalarMix {
    type Value = FromType<{
      a: string;
      b: number;
      c: boolean;
    }>;

    type ValueType = ZodObject<{
      a: ZodString;
      b: ZodNumber;
      c: ZodBoolean;
    }>;

    const implementation = z.object<Value>({
      a: z.string(),
      b: z.number(),
      c: z.boolean(),
    });

    type ValueTypeOf = typeof implementation;

    type Case_WithType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ZodObject<Value>, ValueType>>;
    type Case_WithImplementation = Grok.Assert.IsTrue<Grok.Value.IsExactly<ZodObject<Value>, ValueTypeOf>>;
    type Case_WithImplementationType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueTypeOf, ValueType>>;

    const assertion: ZodObject<Value> = implementation;
  }

  /**
   * @internal {@link FromType}
   */
  export namespace Test_FromType_ObjectWithDeepObject {
    type Value = FromType<{
      a: string;
      b: number;
      c: boolean;

      d: {
        e: string;
        f: string;
      };
    }>;

    type ValueType = ZodObject<{
      a: ZodString;
      b: ZodNumber;
      c: ZodBoolean;

      d: ZodObject<{
        e: ZodString;
        f: ZodString;
      }>;
    }>;

    const implementation = z.object<Value>({
      a: z.string(),
      b: z.number(),
      c: z.boolean(),

      d: z.object({
        e: z.string(),
        f: z.string(),
      }),
    });

    type ValueTypeOf = typeof implementation;

    type Case_WithType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ZodObject<Value>, ValueType>>;
    type Case_WithImplementation = Grok.Assert.IsTrue<Grok.Value.IsExactly<ZodObject<Value>, ValueTypeOf>>;
    type Case_WithImplementationType = Grok.Assert.IsTrue<Grok.Value.IsExactly<ValueTypeOf, ValueType>>;

    const assertion: ZodObject<Value> = implementation;
  }
}
