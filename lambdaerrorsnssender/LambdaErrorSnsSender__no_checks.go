//go:build no_runtime_type_checking

package lambdaerrorsnssender

// Building without runtime type checking enabled, so all the below just return nil

func validateLambdaErrorSnsSender_IsConstructParameters(x interface{}) error {
	return nil
}

func validateNewLambdaErrorSnsSenderParameters(scope constructs.Construct, id *string, props *LambdaErrorSnsSenderProps) error {
	return nil
}

