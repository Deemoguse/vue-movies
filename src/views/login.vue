<template lang="pug">
//- start
AppBox(:class="$style.box")
	AppDecorationTitle(is="h1" :class="$style.logo")
		| MOVIES

	form(@submit="onSubmit")
		div(:class="$style.inputs")
			AppInput(
				type="email"
				v-model:value="login.value"
				v-model:valid="login.valid"
				:validator="loginValidator"
				:placeholder="'Enter e-mail'"
				:label="'Login'"
				:error-message="login.errorMessage"
				:styled="'bordered'"
				@focus="errorMessage = ''"
			)
			AppInput(
				type="password"
				v-model:value="password.value"
				v-model:valid="password.valid"
				:validator="passwordValidator"
				:placeholder="'Enter password'"
				:label="'Password'"
				:error-message="password.errorMessage"
				:styled="'bordered'"
				@focus="errorMessage = ''"
			)

		div(v-if="errorMessage" :class="$style.error")
			| {{ errorMessage }}

		div(:class="$style.buttons")
			AppButton(:class="$style.button" is="button" :disabled="hasError")
				| Log In
			RouterLink(to="/register" :custom="true" v-slot="{navigate}")
				AppButton(:class="$style.button" is="a" styled="bordered-black" color="black" @click="navigate")
					| Register Now

//- end
</template>

<script lang="ts">
import { RouterLink, useRouter } from 'vue-router';
import { computed, defineComponent, reactive, ref } from 'vue';
import AppInput from '@/components/AppInput.vue';
import AppButton from '@/components/AppButton.vue';
import AppBox from '@/components/AppBox.vue';
import AppDecorationTitle from '@/components/AppDecorationTitle.vue';
import useInputValidator from '@/hooks/useInputValidator'
import usetestEmail from '@/hooks/useTestEmail';
import useUserList from '@/store/useUserList';
import useUserData from '@/store/useUserData';
import type { Input } from '@/types/components/AppInput';

export default defineComponent({
	setup () {
		const router = useRouter();
		const userList = useUserList();
		const userData = useUserData();

		const login = reactive<Input>({ value: '', valid: true });
		const password = reactive<Input>({ value: '', valid: true });
		const hasError = computed<boolean>(() => !login.valid || !password.valid);
		const errorMessage = ref<string>('');

		/* Validation Methods */
		const loginValidator = useInputValidator(login, [
			{ validator: (value) => !!value, message: 'Please, enter your e-mail.' },
			{ validator: (value) => /@/.test(value), message: 'Missing "@" symbol' },
			{ validator: (value) => usetestEmail(value), message: 'Enter your actual e-mail.' }
		]);
		const passwordValidator = useInputValidator(password, [
			{ validator: (value) => !!value, message: 'Please, enter your password.' },
			{ validator: (value) => value.length > 6, message: 'Password must have at least 6 characters' },
		]);

		/* Submit Method */
		async function onSubmit (event: Event): Promise<void> {
			event.preventDefault();
			login.valid = loginValidator(login.value);
			password.valid = passwordValidator(password.value);

			if (!hasError.value) try {
				const user = await userList.authUser(login.value, password.value);
				userData.setUser(user);
				router.push('/dashboard');
			} catch (e: any) {
				login.valid = false;
				login.errorMessage = '';
				password.valid = false;
				password.errorMessage = '';
				errorMessage.value = e.body;
			}
		}

		return { errorMessage, login, password, hasError, loginValidator, passwordValidator, onSubmit };
	},
	components: { AppInput, AppButton, RouterLink, AppBox, AppDecorationTitle }
})
</script>

<style lang="stylus" module>
/* Box */
.box
	margin 200px auto 0
	max-width 500px

/* Logo */
.logo
	padding 20px 0

/* Inputs */
.inputs
	& > * + *
		margin-top 20px

/* Buttons */
.buttons
	display flex
	margin-top 75px
	& > * + * { margin-left: 15px; }

/* Button */
.button
	flex 1
	font-size 24px
	font-family 'Koulen'

/*  */
.error
	padding 23px 0 0
	font-size 20px
	color var(--red-300)
</style>