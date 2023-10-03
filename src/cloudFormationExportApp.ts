import { App, DefaultStackSynthesizer } from 'aws-cdk-lib';
import { CloudFormationExportStack } from './cloudFormationExport';

const app = new App();

new CloudFormationExportStack(app, 'lambda-error-sns-sender-cf', {
  synthesizer: new DefaultStackSynthesizer({
    generateBootstrapVersionRule: false,
  }),
});

app.synth();
