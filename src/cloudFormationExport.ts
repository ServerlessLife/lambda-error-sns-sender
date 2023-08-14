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

    const snsErrorFunc = lambdaErrorSnsSender.node.findChild(
      'lambdaSnsError',
    ) as lambda.Function;

    // const lambdaPermissions = snsErrorFunc.node
    //   .findAll()
    //   .filter(
    //     (s) => s instanceof lambda.CfnPermission
    //   ) as lambda.CfnPermission[];

    //for (const lambdaPermission of lambdaPermissions) {

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

      // console.log('statement.resources', statement.resources);
      // if (statement && statement.condition.stringEquals) {
      //   const condition = statement.condition.stringEquals;
      //   if (
      //     condition['aws:SourceArn'] &&
      //     conditionsDict[condition['aws:SourceArn']]
      //   ) {
      //     statement.condition = conditionsDict[condition['aws:SourceArn']];
      //   }
      // }
    }

    // set logical id to override the default logical id of snsErrorFunc
    // (snsErrorFunc.node.defaultChild as lambda.CfnFunction).overrideLogicalId(
    //   'lambda-sns-error'
    // );

    //console.log(snsErrorFunc.permissionsNode.children);

    setNodeNames(this.node.children);
    //let i = 0;
    //for (const construct of snsErrorFunc.node.children) {
    // for (const construct of snsErrorFunc.permissionsNode.children) {
    //   if (construct instanceof lambda.CfnPermission) {
    //     construct.overrideLogicalId(`${snsErrorFunc.node.id}${i}`);
    //     i++;
    //   }
    // }

    lambdaPolicy.policyDocument = {
      Statement: newPolicyStatements,
    };

    // const l = lambdaErrorSnsSender.node.findChild('lambda-sns-error');
    // console.log(l);
    // (l.node.defaultChild as lambda.CfnFunction).overrideLogicalId(
    //   'lambda-sns-error'
    // );
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
    //console.log(construct.node.id);
    let newParentName = parentName;

    // console.log('  construct instanceof Node = ' + (construct instanceof Node));

    // if (construct instanceof Node) {
    //   console.log(
    //     '  construct.defaultChild instanceof cdk.CfnElement = ' +
    //       (construct.defaultChild instanceof cdk.CfnElement)
    //   );
    // }

    if (
      //construct instanceof Node &&
      construct.node.defaultChild instanceof cdk.CfnElement
    ) {
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
