import type { Input } from '@/types/components/AppInput';
import type { InputValidatorRule } from '@/types/hooks/InputValidatorRules';

/**
 *	Creates and returns a validation function according to the described
 * rules for the `validator` property of the `AppInput` component.
 * @param context reactive objects with {@link Input} interface.
 * @param rules a set of {@link InputValidatorRule} for validating the field value.
 **/
export default function useInputValidator (
	context: Input,
	rules: InputValidatorRule[]
): (value: Input['value']) => boolean {
	return function (value: Input['value']): boolean {
		for (let i = 0; i < rules.length; i++) {
			const step = rules[i];
			if (step.validator(value) === false) {
				context.errorMessage = step.message;
				return false;
			}
		}
		return true;
	}
}