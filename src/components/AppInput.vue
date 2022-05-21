<template lang="pug">
//- start
div(:class="computedClass")
	div(v-if="label" :class="$style.label")
		| {{ label }}

	input(
		:type="type"
		:class="[$style.input]"
		:value="value"
		:placeholder="placeholder"
		@input="onInput"
		@focus="onFocus"
		@blur="onBlur"
	)

	div(v-if="errorMessage && !valid" :class="$style.error")
		| {{ errorMessage }}

//- end
</template>

<script lang="ts">
import { defineComponent, ref, computed, useCssModule } from 'vue';
import type { InputType, InputValidator, InputStyles } from '@/types/components/AppInput';

export default defineComponent({
	emits: ['update:value', 'update:valid', 'focus', 'input', 'blur'],
	props: {
		// required
		value: {
			type: String,
			required: true
		},
		valid: {
			type: Boolean,
			default: true,
		},
		// options
		validator: {
			type: Function as InputValidator,
			default: undefined
		},
		type: {
			type: String as InputType,
			default: 'text'
		},
		label: {
			type: String,
			default: undefined
		},
		placeholder: {
			type: String,
			default: ''
		},
		errorMessage: {
			type: String,
			default: undefined,
		},
		styled: {
			type: String as InputStyles,
			default: 'underline',
		}
	},
	setup (props, { emit }) {
		const isFocus = ref<boolean>(false);

		// Action Methods:
		function _validation (value: string): boolean {
			return props.validator ? props.validator(value) : true;
		}
		function onInput (event: Event): void {
			const target = event.target as HTMLInputElement;
			emit('update:value', target.value);
			emit('update:valid', _validation(target.value));
			emit('input', target);
		}
		function onFocus (event: Event): void {
			const target = event.target as HTMLInputElement;
			isFocus.value = true;
			emit('focus', target);
		}
		function onBlur (event: Event): void {
			const target = event.target as HTMLInputElement;
			isFocus.value = false;
			emit('update:valid', _validation(target.value));
			emit('blur', target);
		}

		// Computed Classname:
		const style = useCssModule();
		const computedClass = computed(() => [
			[style.container, style[props.styled]],
			{[style.invalid]: !isFocus.value && !props.valid},
			{[style.hasLabel]: !!props.label},
		]);

		return { onInput, onFocus, onBlur, computedClass };
	},
})

</script>

<style lang="stylus" module>
/* Container */
.container
	position relative

	// states
	&.invalid
		color var(--red-300)

/* Label */
.label
	position absolute
	top 0
	font-weight bold

	.bordered.hasLabel &
		left 20px
		padding 0 7px
		background-color var(--white)

/* Input */
.input
	width 100%
	font-size 20px

	.invalid &
		color var(--red-400)

	&:-webkit-autofill
		-webkit-box-shadow 0 0 0 1000px var(--white) inset !important

	&::placeholder
		color var(--gray-200)
		.invalid &
			color var(--red-100)

	.underline &
		padding-top 5px
		padding-bottom 6px
		border-bottom 2px solid var(--gray-200)
		^[-1..1].invalid ^[0]
			border-color var(--red-100)

	.underline.hasLabel &
		padding-top 24px;

	.bordered &
		margin-top 8px
		padding 15px 25px 13px
		border 2px solid var(--gray-200)
		border-radius 7px
		^[-1..1].invalid ^[0]
			border-color var(--red-100)

/* Error Message */
.error
	margin-top 10px
</style>