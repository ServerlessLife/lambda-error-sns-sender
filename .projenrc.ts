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

project.tsconfigDev.include.push('functions/**/*.ts');
project.package.addField('workspaces', ['functions']);
project.gitignore.exclude('!functions/**/tsconfig.json');

const esbuilTask = project.addTask('esbuild', {
  exec: `
  esbuild --bundle --minify --platform=node --external:@aws-sdk --format=esm functions/lambdaSnsError/index.ts --outfile=lib/functions/lambdaSnsError/index.mjs
  cp functions/package.json lib/functions/lambdaSnsError
  `,
});

project.tasks.tryFind('post-compile')!.prependSpawn(esbuilTask);

project.synth();
