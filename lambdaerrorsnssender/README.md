# Lambda Error SNS Sender

## A simple solution to improve the CloudWatch alarm to receive Lambda error details by email. Available as CDK construct or as CloudFormation.

How does it work:

* Lambda is subscribed to the SNS topic where you receive your alarms. There is a message body subscription filter that limits errors based on the Lambda error metric. If you defied your metic in some other way, not the default one, you will have to change that filter.
* Lambda analyzes the message, finds a log of the failed Lambda, and queries the log for the period that the metic was configured, plus some additional safety time, so we do not miss that error message. It extracts just a number of errors that can fit in one SNS message.
  -Lambda sends errors to the same SNS you use for alerts. So apart from the common Alarm message, you will receive an additional one with error messages.
