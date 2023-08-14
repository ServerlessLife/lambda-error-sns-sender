// CDK construct to send Lambda detail errors to AWS SNS Topic.
package lambdaerrorsnssender

import (
	"reflect"

	_jsii_ "github.com/aws/jsii-runtime-go/runtime"
)

func init() {
	_jsii_.RegisterClass(
		"lambda-error-sns-sender.LambdaErrorSnsSender",
		reflect.TypeOf((*LambdaErrorSnsSender)(nil)).Elem(),
		[]_jsii_.Member{
			_jsii_.MemberProperty{JsiiProperty: "node", GoGetter: "Node"},
			_jsii_.MemberMethod{JsiiMethod: "toString", GoMethod: "ToString"},
		},
		func() interface{} {
			j := jsiiProxy_LambdaErrorSnsSender{}
			_jsii_.InitJsiiProxy(&j.Type__constructsConstruct)
			return &j
		},
	)
	_jsii_.RegisterStruct(
		"lambda-error-sns-sender.LambdaErrorSnsSenderProps",
		reflect.TypeOf((*LambdaErrorSnsSenderProps)(nil)).Elem(),
	)
}
