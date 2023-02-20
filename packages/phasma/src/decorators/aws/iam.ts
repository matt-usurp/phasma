import { createResourceDecorator } from '../resource';

export const KEY_RESOURCE_IAM_ROLE = 'iam-role';
export const KEY_RESOURCE_IAM_POLICY = 'iam-policy';


export const IamRole = createResourceDecorator(KEY_RESOURCE_IAM_ROLE);

export const IamPolicy = createResourceDecorator(KEY_RESOURCE_IAM_POLICY);
