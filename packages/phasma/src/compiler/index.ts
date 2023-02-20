import type { MetadataTarget } from '../decorators/metadata';
import type { ResourceDefinition } from '../decorators/resource';
import { load } from './load';
import { resolve } from './resolve';

export type DefinedStack = {
  resources: ResourceDefinition[];
  resourcesById: Record<string, ResourceDefinition>;
  targetsById: Record<string, MetadataTarget>;
  resourcesByTargetId: Record<string, ResourceDefinition[]>;
};

export const compile = (...resources: MetadataTarget[]) => {
  const stack = load(resources);
  const resolvedStack = resolve(stack);
};
