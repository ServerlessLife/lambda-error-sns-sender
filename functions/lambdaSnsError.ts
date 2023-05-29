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

export const handler = async (event: SNSEvent) => {
  try {
    // only "ALARM" messages, not "OK"
    const messages = event.Records.filter((r) =>
      r.Sns.Subject.startsWith('ALARM:')
    ).map((r) => JSON.parse(r.Sns.Message));

    let metrics: { functionName: string; periodTotal: number }[] = messages
      .filter(
        (m) =>
          m.Trigger &&
          m.Trigger.Period &&
          m.Trigger.Dimensions?.length === 1 &&
          m.Trigger.Dimensions[0]?.name === 'FunctionName' &&
          m.Trigger.Dimensions[0]?.value
      )
      .map((m) => ({
        functionName: m.Trigger.Dimensions[0].value as string,
        periodTotal: (m.Trigger.Period * (m.Trigger.EvaluationPeriods ?? 1)) as
          | number,
      }));

    const lambdaNames = [...new Set(metrics.map((m) => m.functionName))];

    if (lambdaNames.length === 0) {
      return;
    }

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

      const joinedLogs = logs.join('\n');
      const batch = joinedLogs;

      let stringBuffer = Buffer.from(batch, 'utf-8');
      const maxLength = 240000; // actual max is 262144;
      stringBuffer = Buffer.from(
        stringBuffer.buffer,
        stringBuffer.byteOffset,
        Math.min(stringBuffer.length, maxLength)
      );

      const input: PublishCommandInput = {
        TopicArn: process.env.SNS_TOPIC_ARN,
        Message: stringBuffer.toString('utf-8'),
      };

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
