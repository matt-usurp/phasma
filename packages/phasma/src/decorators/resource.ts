import type { MetadataTarget } from './metadata';
import { getMetadataValueForKey, pushMetadataValueForKey } from './metadata';

export const KEY_RESOURCE_DEFINITIONS = 'resources';

export type ResourceDefinition = {
  readonly type: string;
  readonly id: string;
  readonly configs: ResourceDefinitionConfig[];
};

export type ResourceDefinitionConfig = {
  readonly type: string;
  [key: string]: unknown;
};

export type ResourceConfigurator = () => ResourceDefinitionConfig;

export const getResourceDefinitions = (target: MetadataTarget): ResourceDefinition[] => {
  return getMetadataValueForKey(target, KEY_RESOURCE_DEFINITIONS) ?? [];
};

export const createResourceDecorator = (type: string) => (id: string, configurators?: ResourceConfigurator[]): ClassDecorator => {
  return (target) => {
    const configs = configurators?.map<ResourceDefinitionConfig>((fn) => fn()) ?? [];

    pushMetadataValueForKey<ResourceDefinition>(target, KEY_RESOURCE_DEFINITIONS, {
      type,
      id,
      configs,
    });
  };
};
