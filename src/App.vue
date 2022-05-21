<template lang="pug">
//- start
component(:is="layoutName")
	RouterView

//- end
</template>

<script lang="ts">
import { storeToRefs } from 'pinia';
import { defineComponent, watch } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import AuthLayout from '@/layouts/auth.vue';
import MainLayout from '@/layouts/main.vue';
import useUserList from '@/store/useUserList';
import useUserData from '@/store/useUserData';

export default defineComponent({
	computed: {
		layoutName (): string {
			return this.$route.meta.layout as string + '-layout';
		}
	},
	setup () {
		const userId: string = localStorage.userId;
		const token: string = localStorage.token;
		const userList = useUserList();
		const userData = useUserData();
		const userDataRef = storeToRefs(userData);
		const router = useRouter();
		const protectViews = router.options.routes.filter(el => el.meta?.protected).map(el => el.name);

		// Download data from local store:
		userList.uploadData();

		// Checking the relevance of the session
		userList.sessionIsRelevance(userId, token)
			.then(() => userList.authUserById(userId, token).then(user => userData.setUser(user)))
			.catch(() => userData.closeSession());

		// Redirecting from root to `/login` or `/dashboard`:
		router.beforeEach(to => {
			if (to.path === '/')
				return userData.auth ? '/dashboard' : '/login';
		});

		// Redirecting from `/login` to `/dashboard` for auth users:
		router.beforeEach(to => {
			if (userData.auth && to.name === 'login')
				return '/dashboard';
		});

		/**
		 * Initializing an instance of `beforeEach` to protect views.
		 * @see {@link router.beforeEach}
		 **/
		function initDefender (): ReturnType<typeof router.beforeEach> {
			return router.beforeEach(to => {
				if (!userData.auth && protectViews.includes(to.name!))
					return '/login';
			});
		}
		let killDefender = initDefender();

		// Kill the defender after authorization
		// and initialize after closing the session:
		watch(userDataRef.auth, () => {
			if (!userDataRef.auth.value) return killDefender();
			killDefender = initDefender();
		});
	},
	components: { RouterView, AuthLayout, MainLayout }
})
</script>