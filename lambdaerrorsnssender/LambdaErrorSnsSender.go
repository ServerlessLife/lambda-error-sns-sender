package lambdaerrorsnssender

import (
	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
	_init_ "github.com/ServerlessLife/lambda-error-sns-sender/lambdaerrorsnssender/jsii"

	"github.com/aws/constructs-go/constructs/v10"
	"github.com/ServerlessLife/lambda-error-sns-sender/lambdaerrorsnssender/internal"
)

type LambdaErrorSnsSender interface {
	constructs.Construct
	// The tree node.
	Node() constructs.Node
	// Returns a string representation of this construct.
	ToString() *string
}

// The jsii proxy struct for LambdaErrorSnsSender
type jsiiProxy_LambdaErrorSnsSender struct {
	internal.Type__constructsConstruct
}

func (j *jsiiProxy_LambdaErrorSnsSender) Node() constructs.Node {
	var returns constructs.Node
	_jsii_.Get(
		j,
		"node",
		&returns,
	)
	return returns
}


func NewLambdaErrorSnsSender(scope constructs.Construct, id *string, props *LambdaErrorSnsSenderProps) LambdaErrorSnsSender {
	_init_.Initialize()

	if err := validateNewLambdaErrorSnsSenderParameters(scope, id, props); err != nil {
		panic(err)
	}
	j := jsiiProxy_LambdaErrorSnsSender{}

	_jsii_.Create(
		"lambda-error-sns-sender.LambdaErrorSnsSender",
		[]interface{}{scope, id, props},
		&j,
	)

	return &j
}

func NewLambdaErrorSnsSender_Override(l LambdaErrorSnsSender, scope constructs.Construct, id *string, props *LambdaErrorSnsSenderProps) {
	_init_.Initialize()

	_jsii_.Create(
		"lambda-error-sns-sender.LambdaErrorSnsSender",
		[]interface{}{scope, id, props},
		l,
	)
}

// Checks if `x` is a construct.
//
// Returns: true if `x` is an object created from a class which extends `Construct`.
// Deprecated: use `x instanceof Construct` instead.
func LambdaErrorSnsSender_IsConstruct(x interface{}) *bool {
	_init_.Initialize()

	if err := validateLambdaErrorSnsSender_IsConstructParameters(x); err != nil {
		panic(err)
	}
	var returns *bool

	_jsii_.StaticInvoke(
		"lambda-error-sns-sender.LambdaErrorSnsSender",
		"isConstruct",
		[]interface{}{x},
		&returns,
	)

	return returns
}

func (l *jsiiProxy_LambdaErrorSnsSender) ToString() *string {
	var returns *string

	_jsii_.Invoke(
		l,
		"toString",
		nil, // no parameters
		&returns,
	)

	return returns
}

