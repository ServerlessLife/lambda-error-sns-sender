"use strict";
import {
  CloudWatchLogsClient,
  FilterLogEventsCommand
} from "@aws-sdk/client-cloudwatch-logs";
import {
  SNSClient,
  PublishCommand
} from "@aws-sdk/client-sns";
const cloudWatchLogsClient = new CloudWatchLogsClient({});
const snsClient = new SNSClient({});
const maxNumberOfLogs = process.env.MAX_NUMBER_OF_LOGS ? parseInt(process.env.MAX_NUMBER_OF_LOGS) : 100;
export const handler = async (event, context) => {
  try {
    const records = event.Records.filter(
      (r) => r.Sns.Subject.startsWith("ALARM:")
    ).map((r) => ({
      message: JSON.parse(r.Sns.Message),
      topicArn: r.Sns.TopicArn
    }));
    let metrics = records.filter(
      (m) => m.message.Trigger && m.message.Trigger.Period && m.message.Trigger.Dimensions?.length === 1 && m.message.Trigger.Dimensions[0]?.name === "FunctionName" && m.message.Trigger.Dimensions[0]?.value && m.topicArn
    ).map((m) => ({
      functionName: m.message.Trigger.Dimensions[0].value,
      topicArn: m.topicArn,
      periodTotal: (m.message.Trigger.Period ?? 60) * (m.message.Trigger.EvaluationPeriods ?? 1)
    }));
    const functionNames = [...new Set(metrics.map((m) => m.functionName))];
    if (functionNames.length === 0) {
      return;
    }
    for (const functionName of functionNames) {
      if (functionName === context.functionName) {
        continue;
      }
      const periodTotalMax = metrics.filter((m) => m.functionName === functionName).reduce((acc, cur) => Math.max(acc, cur.periodTotal), 0);
      const logsFromDate = new Date(Date.now() - periodTotalMax * 1e3);
      console.log("logsFromDate", logsFromDate.toISOString());
      const logGroupName = await getLogGroupName(functionName);
      const logs = [];
      let nextToken;
      do {
        const filterLogCommand = new FilterLogEventsCommand({
          logGroupName,
          filterPattern: "ERROR",
          startTime: logsFromDate.getTime(),
          nextToken,
          limit: maxNumberOfLogs - logs.length
        });
        const cloudWatchCLogs = await cloudWatchLogsClient.send(
          filterLogCommand
        );
        logs.push(
          ...cloudWatchCLogs.events?.map((e) => `${e.message}`) ?? []
        );
        if (logs.length >= maxNumberOfLogs) {
          break;
        }
        nextToken = cloudWatchCLogs.nextToken;
      } while (nextToken);
      const joinedLogs = `LAMBDA ${functionName} ERRORS:

${logs.join("\n")}`;
      let stringBuffer = Buffer.from(joinedLogs, "utf-8");
      const maxLength = 24e4;
      stringBuffer = Buffer.from(
        stringBuffer.buffer,
        stringBuffer.byteOffset,
        Math.min(stringBuffer.length, maxLength)
      );
      const topicArn = metrics.find(
        (m) => m.functionName === functionName
      )?.topicArn;
      if (!topicArn) {
        throw new Error("TopicArn not found");
      }
      const input = {
        TopicArn: topicArn,
        Message: stringBuffer.toString("utf-8")
      };
      const command = new PublishCommand(input);
      await snsClient.send(command);
    }
  } catch (error) {
    console.error(error);
  }
};
async function getLogGroupName(lambdaName) {
  return `/aws/lambda/${lambdaName}`;
}
