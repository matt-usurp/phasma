import type { ResourceConfigurator } from '../resource';
import { createResourceDecorator } from '../resource';

export const KEY_RESOURCE_LAMBDA_FUNCTION = 'lambda-function';
export const KEY_RESOURCE_LAMBDA_FUNCTION_HANDLER = 'lambda-function:handler';
export const KEY_RESOURCE_LAMBDA_FUNCTION_RUNTIME = 'lambda-function:runtime';
export const KEY_RESOURCE_LAMBDA_FUNCTION_MEMORY = 'lambda-function:memory';
export const KEY_RESOURCE_LAMBDA_FUNCTION_CONFIG_SOURCE = 'lambda-function:source';
export const KEY_RESOURCE_LAMBDA_FUNCTION_ARCHITECTURES = 'lambda-function:architectures';

export const LambdaFunction = createResourceDecorator(KEY_RESOURCE_LAMBDA_FUNCTION);

export const LambdaFunctionHandler = (handler: string): ResourceConfigurator => {
  return () => {
    return {
      type: KEY_RESOURCE_LAMBDA_FUNCTION_HANDLER,
      handler,
    };
  };
};

export const LambdaFunctionMemory = (size: number): ResourceConfigurator => {
  return () => {
    return {
      type: KEY_RESOURCE_LAMBDA_FUNCTION_MEMORY,
      memory: size,
    };
  };
};

type LambdaFunctionSource = (
  | { type: 's3Object'; key: string; version?: string }
  | { type: 'image'; uri: string }
  | { type: 'file'; path: string }
);

export const LambdaFunctionSource = (source: LambdaFunctionSource, hash?: string): ResourceConfigurator => {
  return () => {
    return {
      type: KEY_RESOURCE_LAMBDA_FUNCTION_CONFIG_SOURCE,
      source,
      hash,
    };
  };
};

type LambdaFunctionArchitecture = 'x86_64' | 'arm64';

export const LambdaFunctionArchitectures = (architectures: [LambdaFunctionArchitecture]): ResourceConfigurator => {
  return () => {
    return {
      type: KEY_RESOURCE_LAMBDA_FUNCTION_ARCHITECTURES,
      architectures,
    };
  };
};

type LambdaFunctionRuntime = (
  | 'nodejs '
  | 'nodejs4.3 '
  | 'nodejs6.10 '
  | 'nodejs8.10 '
  | 'nodejs10.x '
  | 'nodejs12.x '
  | 'nodejs14.x '
  | 'nodejs16.x '
  | 'java8 '
  | 'java8.al2 '
  | 'java11 '
  | 'python2.7 '
  | 'python3.6 '
  | 'python3.7 '
  | 'python3.8 '
  | 'python3.9 '
  | 'dotnetcore1.0 '
  | 'dotnetcore2.0 '
  | 'dotnetcore2.1 '
  | 'dotnetcore3.1 '
  | 'dotnet6 '
  | 'nodejs4.3-edge '
  | 'go1.x '
  | 'ruby2.5 '
  | 'ruby2.7 '
  | 'provided '
  | 'provided.al2 '
  | 'nodejs18.x'
);

export const LambdaFunctionRuntime = (runtime: LambdaFunctionRuntime): ResourceConfigurator => {
  return () => {
    return {
      type: KEY_RESOURCE_LAMBDA_FUNCTION_RUNTIME,
      runtime,
    };
  };
};
