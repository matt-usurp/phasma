import 'reflect-metadata';

type ResourceType = string;
type ResourceName = string;

export type ResourceDefinition = Record<string, unknown>;
export type ResourceReference = { $ref: string };

export type ResourceTypeMapping = Record<ResourceName, ResourceDefinition | ResourceReference>;
export type MetadataStackResources = Record<ResourceType, ResourceTypeMapping>;

const r: MetadataStackResources = {
  'aws_lambda_function': {
    'dfgfdg': {
      configs: [
        { name: 'get-user-collection' },
        { memory: 512 },
      ],
      name: 'get-user-collection',
    },
    'ffdg': {
      $ref: 'dfgdfgd',
    },
  },
};

// ---

export type TerraformResourceIdentifier = string;

export type GeneratorReferenceProvider = () => TerraformResourceIdentifier;

// stack class level
declare function Generate(generator: string): ClassDecorator;

// stack property level
declare function TerraformId(id: string): PropertyDecorator;

// interface TerraformResource {
//   (reference: GeneratorReferenceProvider): PropertyDecorator;
//   (id: string, configurators: ConfigurationFunction[]): PropertyDecorator;
// }

// resources
declare function BindEvent(fn: ConfigurationFunction): PropertyDecorator;

declare function ApiGateway(): PropertyDecorator;

declare function ApiGatewayRoute(target: ConfigurationFunction, method: string, path: string): ConfigurationFunction;

function LambdaFunction(reference: GeneratorReferenceProvider): PropertyDecorator;
function LambdaFunction(id: string, configurators: ConfigurationFunction[]): PropertyDecorator;
function LambdaFunction(idRef: GeneratorReferenceProvider | string, configurators?: ConfigurationFunction[]): PropertyDecorator {
  if (typeof idRef === 'function') {
    const resourceId = idRef();
    return (target, property) => {
      const resources = Reflect.getMetadata('resources', target) ?? {};

      // data.aws_lambda_function
      resources['aws_lambda_function'] = {
        property,
        reference: idRef(),
      };

      Reflect.defineMetadata('resources', resources, target);
    };
  }

  return (target, property) => {
    Reflect.defineMetadata('resources', ['aws_lambda_function'], target);

  };
}

// declare function LambdaFunction(reference: 'terraform:ref'): PropertyDecorator;
// declare function LambdaFunction(name: string, configurators: ConfigurationFunction[]): PropertyDecorator;

declare function LambdaFunctionConfig(size: number): ConfigurationFunction;
declare function LambdaFunctionEntrypoint(entrypoint: NodeModuleEntrypoint): ConfigurationFunction;
declare function LambdaFunctionMemory(size: number): ConfigurationFunction;
declare function LambdaFunctionEnvironment(name: string, value: string | ConfigurationFunction): ConfigurationFunction;

declare function CloudWatchLogGroup(config: { days?: number }): ConfigurationFunction;

declare function IamRole(name: string): ConfigurationFunction;
declare function IamPolicy(...templates: Template[]): ConfigurationFunction;

declare function SQSQueue(name: string, configurators?: ConfigurationFunction[]): PropertyDecorator;

declare function StackReference(id: string): ConfigurationFunction;

// helpers
declare function TerraformReference(id: string): GeneratorReferenceProvider;
declare function TerraformReferenceProperty(id: string, property: string): GeneratorReferenceProvider;

declare class Template {
  public static readonly delegate: unknown;
}

declare class DatabaseReadTemplate extends Template {}
declare class DatabaseWriteTemplate extends Template {}

declare class Stack {
  public readonly stack: unknown;
}

declare type NodeModuleEntrypoint = NodeModule & { handler: () => void };
declare const entrypoint: NodeModuleEntrypoint;

declare type ConfigurationFunction = () => void;

@Generate('cdktf')
class InfrastructureStack extends Stack {
  public usersDynamoDbTable: unknown;

  @TerraformId('resource')
  @ApiGateway()
  public gateway!: unknown;

  @LambdaFunction(TerraformReference('my-authoriser'))
  public authoriser!: unknown;

  @LambdaFunction('get-users-collection', [
    LambdaFunctionMemory(512),
    LambdaFunctionEntrypoint(entrypoint),
    LambdaFunctionEnvironment('queue', TerraformReferenceProperty('queue', 'arn')),

    CloudWatchLogGroup({ days: 5 }),

    IamRole('generated-name'),
    IamPolicy(DatabaseReadTemplate, DatabaseWriteTemplate),
  ])
  @BindEvent(ApiGatewayRoute(StackReference('gateway'), 'GET', '/users'))
  public usersCollectionEndpoint!: unknown;

  @SQSQueue('some-queue')
  public queue!: unknown;
}

// alt

@SQSQueue('emails')
class EmailQueue {}

@LambdaFunction('get-users-collection', [
  LambdaFunctionMemory(512),
  LambdaFunctionEntrypoint(__filename),
  LambdaFunctionEnvironment('queue', TerraformReferenceProperty('queue', 'arn')),

  CloudWatchLogGroup({ days: 5 }),

  IamRole('generated-name'),
  IamPolicy(DatabaseReadTemplate, DatabaseWriteTemplate),
])
@BindEvent(ApiGatewayRoute(StackReference('gateway'), 'GET', '/users'))
class UserCollectionHandler {}

createFromComposition(stack, __dirname, [
  EmailQueue,

  UserCollectionHandler,
]);

// npx phasma cdk synth

// declare const transformer = (stack: InfrastructureStack) => Terraform | CDK | CFN;


// export const entrypoint = (context) => {
//   const users = ref('usersDynamoDbTable').tableName; // users-table-name

//   await dynamo.send(new GetCommand({ table: users }));
// };
