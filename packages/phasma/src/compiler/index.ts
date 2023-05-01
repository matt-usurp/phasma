import { TerraformStack } from 'cdktf';
import type { Construct } from 'constructs';
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

export const createFromComposition = (stack: Construct, dirname: string, targets: MetadataTarget[]) => {
  const resources = resolve(load(targets));

  return class extends TerraformStack {
    public constructor(scope: Construct, id: string) {
      super(scope, id);

      resources.resources.forEach((resource) => {
        new resource.construct(scope, resource.id, resource.configs);
      });
    }
  };

};
