/* eslint-disable @typescript-eslint/no-unused-vars */
export type { Http, Middleware, Response } from '@phasma/handler/src/index';
export { entrypoint as awse, factory as aws, id } from './core/provider';
import * as event from './component/event';
import * as handler from './component/handler';
import * as provider from './component/provider';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import Event = event.LambdaHandlerEvent;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import Handler = handler.LambdaHandler;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export import Provider = provider.LambdaHandlerProvider;
