import 'reflect-metadata';

// eslint-disable-next-line @typescript-eslint/ban-types
export type MetadataTarget = Object;

export const getMetadataKeys = (target: MetadataTarget): string[] => {
  return Reflect.getMetadataKeys(target);
};

export const getMetadataValueForKey = <T>(target: MetadataTarget, key: string): T | undefined => {
  return Reflect.getMetadata(key, target);
};

export const setMetadataValueForKey = <T>(target: MetadataTarget, key: string, value: T): void => {
  Reflect.defineMetadata(key, value, target);
};

export const pushMetadataValueForKey = <T>(target: MetadataTarget, key: string, value: T) => {
  const data = getMetadataValueForKey<T[]>(target, key) ?? [];

  data.unshift(value);

  setMetadataValueForKey(target, key, data);
};
