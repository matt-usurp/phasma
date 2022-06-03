import type { HttpMethod } from '@phasma/handler/src/http/method';
import { define } from './core/metadata';

export const Route = (method: HttpMethod, path: string): ClassDecorator => (target) => {
  define(target, 'phasma:route:method', method);
  define(target, 'phasma:route:path', path);
};

export const Target = (filename: string, member: string): ClassDecorator => (target) => {
  define(target, 'phasma:target:filename', filename);
  define(target, 'phasma:target:member', member);
};

@Target(__filename, 'handler')
@Route('GET', '/users')
export class Foo {}
