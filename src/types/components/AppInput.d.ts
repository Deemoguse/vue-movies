import { PropType } from 'vue';

/**
 * Interface for realization `AppInput.vue`
 *
 * Direct implementation example:
 * ```ts
 * const name = reactive<Input>({ value: 'Name', valid: true })
 * ```
 **/
export interface Input {
	value: string,
	valid?: boolean,
	errorMessage?: string,
	[K: string]: any,
	}

export type InputStyles =
	| PropType<'underline'>
	| PropType<'bordered'>
	;

export type InputType =
	| PropType<'text'>
	| PropType<'number'>
	| PropType<'email'>
	| PropType<'password'>
	| PropType<'textarea'>
	;

export type InputValidator =
	| PropType<((value: Input['value']) => boolean)>
	;