# replace this
# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### LambdaErrorSnsSender <a name="LambdaErrorSnsSender" id="lambda-error-sns-sender.LambdaErrorSnsSender"></a>

#### Initializers <a name="Initializers" id="lambda-error-sns-sender.LambdaErrorSnsSender.Initializer"></a>

```typescript
import { LambdaErrorSnsSender } from 'lambda-error-sns-sender'

new LambdaErrorSnsSender(scope: Construct, id: string, props: LambdaErrorSnsSenderProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSender.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSender.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSender.Initializer.parameter.props">props</a></code> | <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps">LambdaErrorSnsSenderProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="lambda-error-sns-sender.LambdaErrorSnsSender.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="lambda-error-sns-sender.LambdaErrorSnsSender.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="lambda-error-sns-sender.LambdaErrorSnsSender.Initializer.parameter.props"></a>

- *Type:* <a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps">LambdaErrorSnsSenderProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSender.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="lambda-error-sns-sender.LambdaErrorSnsSender.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSender.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="lambda-error-sns-sender.LambdaErrorSnsSender.isConstruct"></a>

```typescript
import { LambdaErrorSnsSender } from 'lambda-error-sns-sender'

LambdaErrorSnsSender.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="lambda-error-sns-sender.LambdaErrorSnsSender.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSender.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="lambda-error-sns-sender.LambdaErrorSnsSender.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### LambdaErrorSnsSenderProps <a name="LambdaErrorSnsSenderProps" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps"></a>

#### Initializer <a name="Initializer" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.Initializer"></a>

```typescript
import { LambdaErrorSnsSenderProps } from 'lambda-error-sns-sender'

const lambdaErrorSnsSenderProps: LambdaErrorSnsSenderProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.analyticsReporting">analyticsReporting</a></code> | <code>boolean</code> | Include runtime versioning information in this Stack. |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.crossRegionReferences">crossRegionReferences</a></code> | <code>boolean</code> | Enable this flag to allow native cross region stack references. |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.description">description</a></code> | <code>string</code> | A description of the stack. |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.env">env</a></code> | <code>aws-cdk-lib.Environment</code> | The AWS environment (account/region) where this stack will be deployed. |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.permissionsBoundary">permissionsBoundary</a></code> | <code>aws-cdk-lib.PermissionsBoundary</code> | Options for applying a permissions boundary to all IAM Roles and Users created within this Stage. |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.stackName">stackName</a></code> | <code>string</code> | Name to deploy the stack with. |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.synthesizer">synthesizer</a></code> | <code>aws-cdk-lib.IStackSynthesizer</code> | Synthesis method to use while deploying this stack. |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.tags">tags</a></code> | <code>{[ key: string ]: string}</code> | Stack tags that will be applied to all the taggable resources and the stack itself. |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.terminationProtection">terminationProtection</a></code> | <code>boolean</code> | Whether to enable termination protection for this stack. |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.snsTopics">snsTopics</a></code> | <code>aws-cdk-lib.aws_sns.Topic[]</code> | *No description.* |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.filter">filter</a></code> | <code>{[ key: string ]: aws-cdk-lib.aws_sns.FilterOrPolicy}</code> | *No description.* |
| <code><a href="#lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.maxNumberOfLogs">maxNumberOfLogs</a></code> | <code>number</code> | *No description.* |

---

##### `analyticsReporting`<sup>Optional</sup> <a name="analyticsReporting" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.analyticsReporting"></a>

```typescript
public readonly analyticsReporting: boolean;
```

- *Type:* boolean
- *Default:* `analyticsReporting` setting of containing `App`, or value of 'aws:cdk:version-reporting' context key

Include runtime versioning information in this Stack.

---

##### `crossRegionReferences`<sup>Optional</sup> <a name="crossRegionReferences" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.crossRegionReferences"></a>

```typescript
public readonly crossRegionReferences: boolean;
```

- *Type:* boolean
- *Default:* false

Enable this flag to allow native cross region stack references.

Enabling this will create a CloudFormation custom resource
in both the producing stack and consuming stack in order to perform the export/import

This feature is currently experimental

---

##### `description`<sup>Optional</sup> <a name="description" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.description"></a>

```typescript
public readonly description: string;
```

- *Type:* string
- *Default:* No description.

A description of the stack.

---

##### `env`<sup>Optional</sup> <a name="env" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.env"></a>

```typescript
public readonly env: Environment;
```

- *Type:* aws-cdk-lib.Environment
- *Default:* The environment of the containing `Stage` if available, otherwise create the stack will be environment-agnostic.

The AWS environment (account/region) where this stack will be deployed.

Set the `region`/`account` fields of `env` to either a concrete value to
select the indicated environment (recommended for production stacks), or to
the values of environment variables
`CDK_DEFAULT_REGION`/`CDK_DEFAULT_ACCOUNT` to let the target environment
depend on the AWS credentials/configuration that the CDK CLI is executed
under (recommended for development stacks).

If the `Stack` is instantiated inside a `Stage`, any undefined
`region`/`account` fields from `env` will default to the same field on the
encompassing `Stage`, if configured there.

If either `region` or `account` are not set nor inherited from `Stage`, the
Stack will be considered "*environment-agnostic*"". Environment-agnostic
stacks can be deployed to any environment but may not be able to take
advantage of all features of the CDK. For example, they will not be able to
use environmental context lookups such as `ec2.Vpc.fromLookup` and will not
automatically translate Service Principals to the right format based on the
environment's AWS partition, and other such enhancements.

---

*Example*

```typescript
// Use a concrete account and region to deploy this stack to:
// `.account` and `.region` will simply return these values.
new Stack(app, 'Stack1', {
  env: {
    account: '123456789012',
    region: 'us-east-1'
  },
});

// Use the CLI's current credentials to determine the target environment:
// `.account` and `.region` will reflect the account+region the CLI
// is configured to use (based on the user CLI credentials)
new Stack(app, 'Stack2', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
});

// Define multiple stacks stage associated with an environment
const myStage = new Stage(app, 'MyStage', {
  env: {
    account: '123456789012',
    region: 'us-east-1'
  }
});

// both of these stacks will use the stage's account/region:
// `.account` and `.region` will resolve to the concrete values as above
new MyStack(myStage, 'Stack1');
new YourStack(myStage, 'Stack2');

// Define an environment-agnostic stack:
// `.account` and `.region` will resolve to `{ "Ref": "AWS::AccountId" }` and `{ "Ref": "AWS::Region" }` respectively.
// which will only resolve to actual values by CloudFormation during deployment.
new MyStack(app, 'Stack1');
```


##### `permissionsBoundary`<sup>Optional</sup> <a name="permissionsBoundary" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.permissionsBoundary"></a>

```typescript
public readonly permissionsBoundary: PermissionsBoundary;
```

- *Type:* aws-cdk-lib.PermissionsBoundary
- *Default:* no permissions boundary is applied

Options for applying a permissions boundary to all IAM Roles and Users created within this Stage.

---

##### `stackName`<sup>Optional</sup> <a name="stackName" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.stackName"></a>

```typescript
public readonly stackName: string;
```

- *Type:* string
- *Default:* Derived from construct path.

Name to deploy the stack with.

---

##### `synthesizer`<sup>Optional</sup> <a name="synthesizer" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.synthesizer"></a>

```typescript
public readonly synthesizer: IStackSynthesizer;
```

- *Type:* aws-cdk-lib.IStackSynthesizer
- *Default:* The synthesizer specified on `App`, or `DefaultStackSynthesizer` otherwise.

Synthesis method to use while deploying this stack.

The Stack Synthesizer controls aspects of synthesis and deployment,
like how assets are referenced and what IAM roles to use. For more
information, see the README of the main CDK package.

If not specified, the `defaultStackSynthesizer` from `App` will be used.
If that is not specified, `DefaultStackSynthesizer` is used if
`@aws-cdk/core:newStyleStackSynthesis` is set to `true` or the CDK major
version is v2. In CDK v1 `LegacyStackSynthesizer` is the default if no
other synthesizer is specified.

---

##### `tags`<sup>Optional</sup> <a name="tags" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.tags"></a>

```typescript
public readonly tags: {[ key: string ]: string};
```

- *Type:* {[ key: string ]: string}
- *Default:* {}

Stack tags that will be applied to all the taggable resources and the stack itself.

---

##### `terminationProtection`<sup>Optional</sup> <a name="terminationProtection" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.terminationProtection"></a>

```typescript
public readonly terminationProtection: boolean;
```

- *Type:* boolean
- *Default:* false

Whether to enable termination protection for this stack.

---

##### `snsTopics`<sup>Required</sup> <a name="snsTopics" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.snsTopics"></a>

```typescript
public readonly snsTopics: Topic[];
```

- *Type:* aws-cdk-lib.aws_sns.Topic[]

---

##### `filter`<sup>Optional</sup> <a name="filter" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.filter"></a>

```typescript
public readonly filter: {[ key: string ]: FilterOrPolicy};
```

- *Type:* {[ key: string ]: aws-cdk-lib.aws_sns.FilterOrPolicy}

---

##### `maxNumberOfLogs`<sup>Optional</sup> <a name="maxNumberOfLogs" id="lambda-error-sns-sender.LambdaErrorSnsSenderProps.property.maxNumberOfLogs"></a>

```typescript
public readonly maxNumberOfLogs: number;
```

- *Type:* number

---



