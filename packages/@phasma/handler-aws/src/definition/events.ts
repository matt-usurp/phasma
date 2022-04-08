import type { HandlerResponsePresetNothing } from '@phasma/handler/src/component/response';
import type * as AwsLambda from 'aws-lambda';
import type { LambdaHandlerEventSource } from '../component/event';
import type { LambdaHandlerResponse } from '../component/response';

export interface LambdaHandlerEventSources {
  readonly 'alb:request': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'alb:request',
        AwsLambda.ALBEvent,
        LambdaHandlerResponse<AwsLambda.ALBResult>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'apigw:authorizer:request': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'apigw:authorizer:request',
        AwsLambda.APIGatewayRequestAuthorizerEvent,
        LambdaHandlerResponse<AwsLambda.APIGatewayAuthorizerResult>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'apigw:authorizer:token': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'apigw:authorizer:token',
        AwsLambda.APIGatewayTokenAuthorizerEvent,
        LambdaHandlerResponse<AwsLambda.APIGatewayAuthorizerResult>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'apigw:proxy:v1': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'apigw:proxy:v1',
        AwsLambda.APIGatewayProxyEvent,
        LambdaHandlerResponse<AwsLambda.APIGatewayProxyResult>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'apigw:proxy:v2': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'apigw:proxy:v2',
        AwsLambda.APIGatewayProxyEventV2,
        LambdaHandlerResponse<AwsLambda.APIGatewayProxyStructuredResultV2>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'appsync': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'appsync',
        AwsLambda.AppSyncResolverEvent<Record<string, unknown>>,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cloudformation:custom-resource': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cloudformation:custom-resource',
        AwsLambda.CloudFormationCustomResourceEvent,
        LambdaHandlerResponse<AwsLambda.CloudFormationCustomResourceResponse>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cloudfront:request': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cloudfront:request',
        AwsLambda.CloudFrontRequestEvent,
        LambdaHandlerResponse<AwsLambda.CloudFrontRequestResult>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cloudfront:response': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cloudfront:response',
        AwsLambda.CloudFrontResponseEvent,
        LambdaHandlerResponse<AwsLambda.CloudFrontResponseResult>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cloudwatch:log': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cloudwatch:log',
        AwsLambda.CloudWatchLogsEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cloudwatch:logs-log': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cloudwatch:logs-log',
        AwsLambda.CloudWatchLogsLogEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cloudwatch:scheduled': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cloudwatch:scheduled',
        AwsLambda.ScheduledEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'codebuild:state': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'codebuild:state',
        AwsLambda.CodeBuildCloudWatchStateEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'codepipeline:job': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'codepipeline:job',
        AwsLambda.CodePipelineEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'codepipeline:cloudwatch': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'codepipeline:cloudwatch',
        AwsLambda.CodePipelineCloudWatchEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cognito:create-auth-challenge': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cognito:create-auth-challenge',
        AwsLambda.CreateAuthChallengeTriggerEvent,
        LambdaHandlerResponse<AwsLambda.CreateAuthChallengeTriggerEvent>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cognito:define-auth-challenge': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cognito:define-auth-challenge',
        AwsLambda.DefineAuthChallengeTriggerEvent,
        LambdaHandlerResponse<AwsLambda.DefineAuthChallengeTriggerEvent>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cognito:custom-message': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cognito:custom-message',
        AwsLambda.CustomMessageTriggerEvent,
        LambdaHandlerResponse<AwsLambda.CustomMessageTriggerEvent>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cognito:pre-authentication': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cognito:pre-authentication',
        AwsLambda.PreAuthenticationTriggerEvent,
        LambdaHandlerResponse<AwsLambda.PreAuthenticationTriggerEvent>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cognito:post-authentication': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cognito:post-authentication',
        AwsLambda.PostAuthenticationTriggerEvent,
        LambdaHandlerResponse<AwsLambda.PostAuthenticationTriggerEvent>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cognito:post-confirmation': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cognito:post-confirmation',
        AwsLambda.PostConfirmationTriggerEvent,
        LambdaHandlerResponse<AwsLambda.PostConfirmationTriggerEvent>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cognito:pre-signup': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cognito:pre-signup',
        AwsLambda.PreSignUpTriggerEvent,
        LambdaHandlerResponse<AwsLambda.PreSignUpTriggerEvent>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cognito:pre-token-generation': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cognito:pre-token-generation',
        AwsLambda.PreTokenGenerationTriggerEvent,
        LambdaHandlerResponse<AwsLambda.PreTokenGenerationTriggerEvent>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cognito:user-migration': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cognito:user-migration',
        AwsLambda.UserMigrationTriggerEvent,
        LambdaHandlerResponse<AwsLambda.UserMigrationTriggerEvent>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'cognito:verify-auth-challenge-response': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'cognito:verify-auth-challenge-response',
        AwsLambda.VerifyAuthChallengeResponseTriggerEvent,
        LambdaHandlerResponse<AwsLambda.VerifyAuthChallengeResponseTriggerEvent>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'connect:contact-flow': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'connect:contact-flow',
        AwsLambda.ConnectContactFlowEvent,
        LambdaHandlerResponse<AwsLambda.ConnectContactFlowResult>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'dynamodb:stream': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'dynamodb:stream',
        AwsLambda.DynamoDBStreamEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'eventbridge': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'eventbridge',
        AwsLambda.EventBridgeEvent<string, Record<string, unknown>>,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'iot': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'iot',
        AwsLambda.IoTEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'kinesis:firehose-transform': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'kinesis:firehose-transform',
        AwsLambda.FirehoseTransformationEvent,
        LambdaHandlerResponse<AwsLambda.FirehoseTransformationResult>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'kinesis:stream': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'kinesis:stream',
        AwsLambda.KinesisStreamEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'lex': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'lex',
        AwsLambda.LexEvent,
        LambdaHandlerResponse<AwsLambda.LexResult>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'msk': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'msk',
        AwsLambda.MSKEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 's3:object': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        's3:object',
        AwsLambda.S3Event,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 's3:batch': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        's3:batch',
        AwsLambda.S3BatchEvent,
        LambdaHandlerResponse<AwsLambda.S3BatchResult>
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'ses': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'ses',
        AwsLambda.SESEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'sns': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'sns',
        AwsLambda.SNSEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );

    readonly 'sqs': (
    /* eslint-disable @typescript-eslint/indent */
      LambdaHandlerEventSource<
        'sqs',
        AwsLambda.SQSEvent,
        HandlerResponsePresetNothing
      >
    /* eslint-enable @typescript-eslint/indent */
    );
}
