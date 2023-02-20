import type { DefinedStack } from '.';
import type { ResourceDefinitionConfig } from '../decorators/resource';

export const resolve = (stack: DefinedStack): DefinedStack => {
  stack.resources = stack.resources.map((resource) => {
    const configs = resource.configs.map((config): ResourceDefinitionConfig => {
      if (config.type === 'stack-reference') {
        config.target = stack.resourcesByTargetId[config.id as string];
      }

      return config;
    });

    return {
      ...resource,
      configs,
    };
  });

  return stack;
};
