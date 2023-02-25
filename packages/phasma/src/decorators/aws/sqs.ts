import { createResourceDecorator } from '../resource';

export const KEY_RESOURCE_SQS_QUEUE = 'sqs-queue';

export const SQSQueue = createResourceDecorator(KEY_RESOURCE_SQS_QUEUE);
