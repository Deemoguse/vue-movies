export interface InputValidatorRule {
	readonly validator: (v: string) => boolean,
	readonly message: string
	};