import {
  CloudWatchLogsClient,
  FilterLogEventsCommand,
} from '@aws-sdk/client-cloudwatch-logs';
import {
  SNSClient,
  PublishCommand,
  PublishCommandInput,
} from '@aws-sdk/client-sns';
import { SNSEvent } from 'aws-lambda';

const cloudWatchLogsClient = new CloudWatchLogsClient({});
const snsClient = new SNSClient({});
const maxNumberOfLogs = process.env.MAX_NUMBER_OF_LOGS
  ? parseInt(process.env.MAX_NUMBER_OF_LOGS)
  : 100;

export const handler = async (event: SNSEvent, context: any) => {
  console.log('EVENT', JSON.stringify(event));
  console.log('CONTEXT', JSON.stringify(context));

  try {
    // only "ALARM" messages, not "OK"
    const records = event.Records.filter((r) =>
      r.Sns.Subject.startsWith('ALARM:')
    ).map((r) => ({
      message: JSON.parse(r.Sns.Message),
      topicArn: r.Sns.TopicArn,
    }));

    console.log('MESSAGES', JSON.stringify(records));

    let metrics: {
      functionName: string;
      periodTotal: number;
      topicArn: string;
    }[] = records
      .filter(
        (m) =>
          m.message.Trigger &&
          m.message.Trigger.Period &&
          m.message.Trigger.Dimensions?.length === 1 &&
          m.message.Trigger.Dimensions[0]?.name === 'FunctionName' &&
          m.message.Trigger.Dimensions[0]?.value &&
          m.topicArn
      )
      .map((m) => ({
        functionName: m.message.Trigger.Dimensions[0].value as string,
        topicArn: m.topicArn as string,
        periodTotal: (m.message.Trigger.Period *
          (m.message.Trigger.EvaluationPeriods ?? 1)) as number,
      }));

    console.log('METRICS', JSON.stringify(metrics));

    // remove duplicates
    const lambdaNames = [...new Set(metrics.map((m) => m.functionName))];

    if (lambdaNames.length === 0) {
      return;
    }

    console.log('LAMBDA NAMES', lambdaNames);

    for (const lambdaName of lambdaNames) {
      const periodTotalMax = metrics
        .filter((m) => m.functionName === lambdaName)
        .reduce((acc, cur) => Math.max(acc, cur.periodTotal), 0);

      const logGroupName = await getLogGroupName(lambdaName);

      //read all clodwatch logs streams
      const logs: string[] = [];

      let nextToken: string | undefined;

      do {
        const filterLogCommand = new FilterLogEventsCommand({
          logGroupName: logGroupName,
          filterPattern: 'ERROR',
          startTime: new Date(
            Date.now() - periodTotalMax * 60 * 1000
          ).getTime(),
          nextToken,
        });

        const cloudWatchCLogs = await cloudWatchLogsClient.send(
          filterLogCommand
        );
        logs.push(
          ...(cloudWatchCLogs.events?.map((e) => `${e.message}`) ?? [])
        );

        if (maxNumberOfLogs > 0 && logs.length > 100) {
          break;
        }

        nextToken = cloudWatchCLogs.nextToken;
      } while (nextToken);

      const joinedLogs = `LAMBDA ${lambdaName} ERRORS:\n\n${logs.join('\n')}`;
      const batch = joinedLogs;

      let stringBuffer = Buffer.from(batch, 'utf-8');
      const maxLength = 240000; // actual max is 262144;
      stringBuffer = Buffer.from(
        stringBuffer.buffer,
        stringBuffer.byteOffset,
        Math.min(stringBuffer.length, maxLength)
      );

      //get topicArn from metrics
      const topicArn = metrics.find(
        (m) => m.functionName === lambdaName
      )?.topicArn;

      if (!topicArn) {
        throw new Error('TopicArn not found');
      }

      const input: PublishCommandInput = {
        TopicArn: topicArn,
        Message: stringBuffer.toString('utf-8'),
      };

      console.log('PUBLISH', JSON.stringify(input));

      const command = new PublishCommand(input);

      await snsClient.send(command);
    }
  } catch (error) {
    // this Lambda should not throw any error
    console.error(error);
  }
};

async function getLogGroupName(
  lambdaName: string
): Promise<string | undefined> {
  return `/aws/lambda/${lambdaName}`;
}
