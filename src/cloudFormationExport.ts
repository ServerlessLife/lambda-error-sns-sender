import {
  App,
  Stack,
  StackProps,
  CfnParameter,
  DefaultStackSynthesizer,
} from 'aws-cdk-lib';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as sns from 'aws-cdk-lib/aws-sns';
import { Construct, IConstruct } from 'constructs';
import { LambdaErrorSnsSender } from './index';

export class CloudFormationExportStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const noOfParameters = 5;
    const snsTopics: sns.Topic[] = [];
    const conditionsDict: Record<string, cdk.CfnCondition> = {};

    for (let i = 1; i <= noOfParameters; i++) {
      const snsTopicArnParam = new CfnParameter(this, `snsTopicArn${i}`, {
        type: 'String',
        description: 'SNS Topic ARN receive alarms and send Lambda errors to.',
      });

      const snsTopic = sns.Topic.fromTopicArn(
        this,
        `snsTopic${i}`,
        snsTopicArnParam.valueAsString,
      );
      snsTopics.push(snsTopic as sns.Topic);

      const condition = new cdk.CfnCondition(this, `conditionSnsTopic${i}`, {
        expression: cdk.Fn.conditionNot(
          cdk.Fn.conditionEquals('', snsTopic.topicArn),
        ),
      });

      conditionsDict[snsTopicArnParam.valueAsString] = condition;
    }

    const maxNumberOfLogsParam = new CfnParameter(this, `maxNumberOfLogs`, {
      type: 'Number',
      description: 'Max number of logs to send to SNS Topic.',
    });

    const lambdaErrorSnsSender = new LambdaErrorSnsSender(
      this,
      'lambdaErrorSnsSender',
      {
        snsTopics: snsTopics,
        maxNumberOfLogs: maxNumberOfLogsParam.valueAsNumber,
      },
    );

    const subscriptions = lambdaErrorSnsSender.node
      .findAll()
      .filter((s) => s instanceof sns.CfnSubscription) as sns.CfnSubscription[];

    for (const subscription of subscriptions) {
      if (conditionsDict[subscription.topicArn]) {
        subscription.cfnOptions.condition =
          conditionsDict[subscription.topicArn];
      }
    }

    const snsErrorFunc = this.node.findChild(
      'lambdaSnsError',
    ) as lambda.Function;

    for (const lambdaPermission of snsErrorFunc.permissionsNode.children) {
      if (lambdaPermission instanceof lambda.CfnPermission) {
        if (
          lambdaPermission.sourceArn &&
          conditionsDict[lambdaPermission.sourceArn]
        ) {
          lambdaPermission.cfnOptions.condition =
            conditionsDict[lambdaPermission.sourceArn];
        }
      }
    }

    const lambdaPolicy = snsErrorFunc.node
      .findAll()
      .find((c) => c instanceof iam.CfnPolicy) as iam.CfnPolicy;

    const newPolicyStatements = [];
    for (const statement of (lambdaPolicy.policyDocument?.statements ??
      []) as iam.PolicyStatement[]) {
      let addCondition = false;
      let condition: cdk.CfnCondition | undefined;

      for (const resource of statement.resources) {
        if (conditionsDict[resource]) {
          addCondition = true;
          condition = conditionsDict[resource];
          break;
        }
      }

      if (addCondition && condition) {
        const newStatement = {
          'Fn::If': [
            condition.logicalId,
            statement.toJSON(),
            ,
            { Ref: 'AWS::NoValue' },
          ],
        };

        newPolicyStatements.push(newStatement);
      } else {
        newPolicyStatements.push(statement.toJSON());
      }
    }

    lambdaPolicy.policyDocument = {
      Statement: newPolicyStatements,
    };

    setNodeNames(this.node.children);
  }
}

const app = new App();

new CloudFormationExportStack(app, 'lambda-error-sns-sender-cf', {
  synthesizer: new DefaultStackSynthesizer({
    generateBootstrapVersionRule: false,
  }),
});

app.synth();

function setNodeNames(constructs: IConstruct[], parentName?: string) {
  let i = 0;
  for (const construct of constructs) {
    let newParentName = parentName;

    if (construct.node.defaultChild instanceof cdk.CfnElement) {
      newParentName = parentName
        ? `${parentName}${construct.node.id}`
        : construct.node.id;
      construct.node.defaultChild.overrideLogicalId(newParentName);
    }

    if (construct instanceof lambda.CfnPermission) {
      construct.overrideLogicalId(`${newParentName}Permission${i}`);
      i++;
    }

    setNodeNames(construct.node.children, newParentName);
  }
}
