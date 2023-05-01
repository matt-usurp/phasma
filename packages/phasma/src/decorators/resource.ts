import type { TerraformResource } from 'cdktf';
import type { Construct } from 'constructs';
import type { MetadataTarget } from './metadata';
import { getMetadataValueForKey, pushMetadataValueForKey } from './metadata';

export const KEY_RESOURCE_DEFINITIONS = 'resources';

export type ResourceConstructor = new (scope: Construct, id: string, config: any) => TerraformResource;

export type ResourceDefinition = {
  readonly type: string;
  readonly id: string;
  readonly construct: ResourceConstructor;
  readonly configs: ResourceDefinitionConfig[];
};

export type ResourceDefinitionConfig = {
  readonly type: string;
  [key: string]: unknown;
};

export type ResourceConfigurator<C extends ResourceDefinitionConfig = ResourceDefinitionConfig> = () => C;

export const getResourceDefinitions = (target: MetadataTarget): ResourceDefinition[] => {
  return getMetadataValueForKey(target, KEY_RESOURCE_DEFINITIONS) ?? [];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const createResourceDecorator = (type: string, construct: ResourceConstructor) => (id: string, configurators?: ResourceConfigurator[]): ClassDecorator => {
  return (target) => {
    const configs = configurators?.map<ResourceDefinitionConfig>((fn) => fn()) ?? [];

    pushMetadataValueForKey<ResourceDefinition>(target, KEY_RESOURCE_DEFINITIONS, {
      type,
      id,
      construct,
      configs,
    });
  };
};
