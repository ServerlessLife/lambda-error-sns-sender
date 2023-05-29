import { awscdk } from 'projen';
import { NodePackageManager } from 'projen/lib/javascript';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Marko (ServerlessLife)',
  authorAddress: 'marko@serverlesslife.com',
  cdkVersion: '2.67.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '~5.0.0',
  name: 'lambda-error-sns-sender',
  projenrcTs: true,
  repositoryUrl:
    'https://github.com/ServerlessLife/lambda-error-sns-sender.git',
  eslint: true,
  packageManager: NodePackageManager.NPM,
  prettier: true,
  prettierOptions: {
    settings: {
      useTabs: false,
      singleQuote: true,
    },
  },
  deps: [] /* Runtime dependencies of this module. */,
  description: 'Send Lambda detail errors to AWS SNS Topic.',
  devDeps: ['typescript', 'esbuild'] /* Build dependencies for this module. */,
  bundledDeps: [
    '@aws-sdk/client-lambda',
    '@aws-sdk/client-cloudwatch-logs',
    '@aws-sdk/client-sns',
    'aws-lambda',
  ],
  jest: false,
  keywords: [
    'aws',
    'cdk',
    'lambda',
    'sns',
    'error',
    'cloudwatch',
    'logs',
    'serverless',
    'alarm',
    'monitoring',
    'email',
  ],
});

const esbuilTask = project.addTask('esbuild', {
  exec: 'esbuild --bundle --platform=node --sourcemap functions/lambdaSnsError.ts --outdir=lib/',
});

project.tasks.tryFind('post-compile')!.prependSpawn(esbuilTask);

project.synth();
