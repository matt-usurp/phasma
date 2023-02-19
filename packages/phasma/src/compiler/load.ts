import type { MetadataTarget } from '../decorators/metadata';
import type { ResourceDefinition } from '../decorators/resource';
import { getResourceDefinitions } from '../decorators/resource';
import type { DefinedStack } from './';

export const load = (targets: MetadataTarget[]): DefinedStack => {
  const resources: ResourceDefinition[] = [];
  const resourcesById: Record<string, ResourceDefinition> = {};
  const targetsById: Record<string, MetadataTarget> = {};
  const resourcesByTargetId: Record<string, ResourceDefinition[]> = {};

  targets.forEach((target) => {
    const targetId = target.name;
    const definition = getResourceDefinitions(target);

    definition.forEach((metadataResource) => {
      resources.push(metadataResource);
      resourcesById[metadataResource.id] = metadataResource;
      targetsById[targetId] = target;
      resourcesByTargetId[targetId] = [...resourcesByTargetId[targetId] ?? [], metadataResource];
    });
  });


  return {
    resources,
    resourcesById,
    targetsById,
    resourcesByTargetId,
  };
};
