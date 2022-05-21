<template lang="pug">
//- start
AppBox(:class="$style.box")
	AppDecorationTitle(:class="$style.title")
		| NEW ACCOUNT

	form(@submit="onSubmit")
		div(:class="$style.inputs")
			AppInput(
				v-for="({ input, validator }, id) in inputsHeap" :key="id"
				v-model:value="input.value"
				v-model:valid="input.valid"
				:validator="validator"
				:type="input.type"
				:styled="'bordered'"
				:label="input.label"
				:placeholder="input.placeholder"
				:error-message="input.errorMessage"
			)
		div(:class="$style.buttons")
			AppButton(:class="$style.button" is="button" styled="filled" :disabled="hasError")
				| Register

			AppButton(:class="$style.button" is="button" styled="bordered-black" @click.prevent="$router.back()")
				| Back
//- end
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import AppBox from '@/components/AppBox.vue';
import AppInput from '@/components/AppInput.vue';
import AppDecorationTitle from '@/components/AppDecorationTitle.vue';
import AppButton from '@/components/AppButton.vue';
import useTestEmail from '@/hooks/useTestEmail';
import useInputValidator from '@/hooks/useInputValidator';
import useUserList from '@/store/useUserList';
import useUserData from '@/store/useUserData';
import type { Input } from '@/types/components/AppInput';

export default defineComponent({
	setup () {
		const router = useRouter();
		const userList = useUserList();
		const userData = useUserData();

		const firstname = reactive<Input>({ value:'', valid: true, type: 'text', label: 'First name', placeholder: 'Enter your first name' });
		const lastname = reactive<Input>({ value: '', valid: true, type: 'text', label: 'Last name', placeholder: 'Enter your last name' });
		const email = reactive<Input>({ value: '', valid: true, type: 'email', label: 'E-mail', placeholder: 'Enter your e-mail' });
		const password = reactive<Input>({ value: '', valid: true, type: 'password', label: 'Passoword', placeholder: 'Enter password' });
		const passwordRepeat = reactive<Input>({ value: '', valid: true, type: 'password', label: 'Repeat password', placeholder: 'Repeat your password' });
		const hasError = computed<boolean>(() => {
			return [firstname, lastname, email, password, passwordRepeat]
				.findIndex(el => el.valid === false) !== -1;
		});

		/* Validation Methods */
		const firstnameValidator = useInputValidator(firstname, [
			{ validator: (value) => !!value, message: 'Please, enter your first name.' },
			{ validator: (value) => value.length >= 2, message: 'The first name must contain at least 2 characters.' },
		]);
		const lastnameValidator = useInputValidator(lastname, [
			{ validator: (value) => !!value, message: 'Please, enter your last name.' },
			{ validator: (value) => value.length >= 2, message: 'The last name must contain at least 2 characters.' },
		]);
		const emailValidator = useInputValidator(email, [
			{ validator: (value) => !!value, message: 'Please, enter your e-mail.' },
			{ validator: (value) => /@/.test(value), message: 'Missing "@" symbol' },
			{ validator: (value) => useTestEmail(value), message: 'Enter your actual e-mail.' }
		]);
		const passwordValidator = useInputValidator(password, [
			{ validator: (value) => !!value, message: 'Please, enter password.' },
			{ validator: (value) => value.length > 6, message: 'Password must have at least 6 characters.' },
		]);
		const passwordRepeatValidator = useInputValidator(passwordRepeat, [
			{ validator: (value) => !!value, message: 'Please, repeat your password.' },
			{ validator: (value) => value === password.value, message: 'Passwords don\'t match.' },
		]);

		const inputsHeap = [
			{ input: firstname, validator: firstnameValidator },
			{ input: lastname, validator: lastnameValidator },
			{ input: email, validator: emailValidator },
			{ input: password, validator: passwordValidator },
			{ input: passwordRepeat, validator: passwordRepeatValidator },
		];

		/* Submit Method */
		async function onSubmit (event: Event): Promise<void> {
			event.preventDefault();
			inputsHeap.forEach(el => el.input.valid = el.validator(el.input.value));

			if (!hasError.value) try {
				const user = await userList.addUser({ login: email.value, password: password.value, firstname: firstname.value, lastname: lastname.value });
				userData.setUser(user);
				router.push('/dashboard');
			} catch (e: any) {
				console.log(e);
				email.valid = false;
				email.errorMessage = e.body;
			}
		}

		return { hasError, inputsHeap, onSubmit };
	},
	components: { AppBox, AppDecorationTitle, AppInput, AppButton }
});
</script>

<style lang="stylus" module>
/* Box */
.box
	position absolute
	inset 50% auto auto 50%
	transform translate(-50%, -50%)
	width 500px

/* title */
.title
	padding 20px 0

/* Inputs */
.inputs
	& > * + *
		margin-top 20px

/* Buttons */
.buttons
	display flex
	padding-top 36px
	border-top 2px solid var(--gray-200)
	margin-top 36px
	& > * + * { margin-left: 15px; }

/* Button */
.button
	width 100%
	font-size 24px
	font-family 'Koulen'
</style>