import * as fs from 'fs';
import * as path from 'path';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as lambda_nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscription from 'aws-cdk-lib/aws-sns-subscriptions';

import { Construct } from 'constructs';

export interface LambdaErrorSnsSenderProps extends cdk.StackProps {
  readonly snsTopics: sns.Topic[];
  readonly maxNumberOfLogs?: number;
}

export class LambdaErrorSnsSender extends Construct {
  constructor(scope: Construct, id: string, props: LambdaErrorSnsSenderProps) {
    super(scope, id);

    if (!props.snsTopics || props?.snsTopics.length === 0) {
      throw new Error('No SNS Topics provided');
    }

    const snsErrorFunc = new lambda_nodejs.NodejsFunction(
      this,
      'lambda-sns-error',
      {
        handler: 'handler',
        entry: getAssetLocation('lib/lambdaSnsError.js'),
        runtime: lambda.Runtime.NODEJS_18_X,
        environment: {
          MAX_NUMBER_OF_LOGS: props?.maxNumberOfLogs?.toString() ?? '100',
        },
      }
    );

    for (const snsTopic of props?.snsTopics) {
      snsTopic.addSubscription(
        new subscription.LambdaSubscription(snsErrorFunc, {
          filterPolicyWithMessageBody: {
            Trigger: sns.FilterOrPolicy.policy({
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
            }),
          },
        })
      );

      snsTopic.grantPublish(snsErrorFunc);

      //grand access to cloudwatch logs
      snsErrorFunc.addToRolePolicy(
        new iam.PolicyStatement({
          actions: ['logs:FilterLogEvents'],
          resources: ['*'],
        })
      );
    }
  }
}

function getAssetLocation(location: string) {
  const loc = path.join(__dirname, '../lib/' + location);

  if (fs.existsSync(loc)) {
    return loc;
  }

  const loc2 = path.join(__dirname, '../../lib/' + location);

  if (fs.existsSync(loc2)) {
    return loc2;
  }

  throw new Error(`Location ${loc} and ${loc2} does not exists.`);
}
