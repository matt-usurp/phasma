import type { Grok } from '@matt-usurp/grok';
import 'reflect-metadata';

interface PhasmaMetadata {
  'phasma:target:filename': string;
  'phasma:target:member': string;

  'phasma:route:method': string;
  'phasma:route:path': string;
}

export const define = <K extends keyof PhasmaMetadata>(target: Grok.Constraint.Anything, key: K, value: PhasmaMetadata[K]) => {
  return Reflect.defineMetadata(key, value, target);
};

export const metadata = <K extends keyof PhasmaMetadata>(target: Grok.Constraint.Anything, key: K): PhasmaMetadata[K] | undefined => {
  return Reflect.getMetadata(key, target);
};
