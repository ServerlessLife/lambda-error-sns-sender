import { awscdk } from 'projen';
import { TaskWorkflow } from 'projen/lib/github';
import { NodePackageManager } from 'projen/lib/javascript';

const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Marko (ServerlessLife)',
  authorAddress: 'marko@serverlesslife.com',
  cdkVersion: '2.70.0',
  defaultReleaseBranch: 'main',
  jsiiVersion: '^5.1.9',
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
  deps: [],
  description: 'CDK construct to send Lambda detail errors to AWS SNS Topic.',
  devDeps: ['typescript', 'esbuild', 'esbuild-runner'],
  jest: false,
  gitignore: ['/cdk.out/'],
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
  publishToPypi: {
    distName: 'lambda-error-sns-sender',
    module: 'lambda-error-sns-sender',
  },
  publishToNuget: {
    packageId: 'ServerlessLife.LambdaErrorSnsSender',
    dotNetNamespace: 'ServerlessLife.LambdaErrorSnsSender',
  },
  publishToMaven: {
    mavenGroupId: 'io.github.serverlesslife',
    javaPackage: 'io.github.serverlesslife.LambdaErrorSnsSender',
    mavenArtifactId: 'LambdaErrorSnsSender',
    mavenEndpoint: 'https://s01.oss.sonatype.org',
  },
  publishToGo: {
    moduleName: 'github.com/ServerlessLife/lambda-error-sns-sender',
  },
});

project.tsconfigDev.include.push('functions/**/*.ts', 'scripts/**/*.ts');
project.package.addField('workspaces', ['functions', 'scripts']);
project.gitignore.exclude('!functions/**/tsconfig.json');
project.gitignore.exclude('!scripts/**/tsconfig.json');

const esbuilTask = project.addTask('esbuild', {
  exec: `
  esbuild --bundle --minify --platform=node --external:@aws-sdk --format=esm functions/lambdaSnsError/index.ts --outfile=lib/functions/lambdaSnsError/index.mjs
  cp functions/package.json lib/functions/lambdaSnsError
  `,
});

project.tasks.tryFind('post-compile')!.prependSpawn(esbuilTask);

// export raw CloudFormation for independent use (see part 3 of the article)
project.addTask('export-cf', {
  steps: [
    {},
    {
      exec: `
        npx cdk synth lambda-error-sns-sender-cf --quiet
        npx esr scripts/copyToS3.ts
  `,
    },
  ],
});

(
  project.github?.workflows.find((x) => x.name === 'release') as TaskWorkflow
).addJob('release_raw_cloudformation', {
  name: 'Publish raw CloudFormation',
  needs: ['release'],
  runsOn: ['ubuntu-latest'],
  permissions: {},
  steps: [
    {
      name: 'Checkout',
      uses: 'actions/checkout@v3',
    },
    {
      name: 'Configure AWS credentials',
      uses: 'aws-actions/configure-aws-credentials@v2',
      with: {
        'aws-access-key-id': '${{ secrets.AWS_ACCESS_KEY_ID }}',
        'aws-secret-access-key': '${{ secrets.AWS_SECRET_ACCESS_KEY }}',
        'aws-region': 'eu-west-1',
      },
    },
    {
      name: 'Setup Node.js',
      uses: 'actions/setup-node@v3',
      with: {
        'node-version': '16.x',
      },
    },
    {
      name: 'Generate files with projen',
      run: 'npx projen',
    },
    {
      name: 'Export CF',
      run: 'npx projen export-cf',
    },
  ],
}),
  console.log();

project.synth();
