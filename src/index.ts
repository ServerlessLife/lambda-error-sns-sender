import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import { FilterOrPolicy } from 'aws-cdk-lib/aws-sns';
import * as subscription from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export interface LambdaErrorSnsSenderProps extends cdk.StackProps {
  readonly snsTopics: sns.Topic[];
  readonly maxNumberOfLogs?: number;
  readonly filter?: {
    [attribute: string]: FilterOrPolicy;
  };
}

export class LambdaErrorSnsSender extends Construct {
  constructor(scope: Construct, id: string, props: LambdaErrorSnsSenderProps) {
    super(scope, id);

    if (!props.snsTopics || props?.snsTopics.length === 0) {
      throw new Error('No SNS Topics provided');
    }

    const snsErrorFunc = new lambda.Function(this, 'lambda-sns-error', {
      handler: 'index.handler',
      code: lambda.Code.fromAsset(
        path.join(__dirname, '../lib/functions/lambdaSnsError')
      ),
      runtime: lambda.Runtime.NODEJS_18_X,
      environment: {
        MAX_NUMBER_OF_LOGS: props?.maxNumberOfLogs?.toString() ?? '100',
      },
    });

    for (const snsTopic of props?.snsTopics) {
      const defaultFilter = {
        MetricName: sns.FilterOrPolicy.filter(
          sns.SubscriptionFilter.stringFilter({
            allowlist: ['Errors'],
          })
        ),
        Namespace: sns.FilterOrPolicy.filter(
          sns.SubscriptionFilter.stringFilter({
            allowlist: ['AWS/Lambda'],
          })
        ),
        StatisticType: sns.FilterOrPolicy.filter(
          sns.SubscriptionFilter.stringFilter({
            allowlist: ['Statistic'],
          })
        ),
        Statistic: sns.FilterOrPolicy.filter(
          sns.SubscriptionFilter.stringFilter({
            allowlist: ['SUM'],
          })
        ),
      };

      snsTopic.addSubscription(
        new subscription.LambdaSubscription(snsErrorFunc, {
          filterPolicyWithMessageBody: {
            Trigger: sns.FilterOrPolicy.policy(props.filter ?? defaultFilter),
          },
        })
      );

      snsTopic.grantPublish(snsErrorFunc);

      //grand access to cloudwatch logs
      snsErrorFunc.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ['logs:FilterLogEvents'],
          resources: ['*'], // I do not know which resources I will need to access
        })
      );
    }
  }
}
