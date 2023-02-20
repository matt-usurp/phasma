import type { ResourceConfigurator } from '../resource';

type StackReferenceConfig = {
  type: 'stack-reference';
  id: string;
  resourceId?: string;
};

export const StackReference = (targetId: string, resourceId?: string): ResourceConfigurator<StackReferenceConfig> => {
  return () => {
    return {
      type: 'stack-reference',
      id: targetId,
      resourceId,
    };
  };
};
