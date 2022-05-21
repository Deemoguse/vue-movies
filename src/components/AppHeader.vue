<template lang="pug">
//- start
header(:class="$style.header")
	div(:class="$style.leftSide")
		button(@click="toggleAside")
			SVGMenu
		component(:is="logoTagName" :to="pathToRoot" :class="$style.logo")
			| MOVIES

	button(@click="closeSession" :class="$style.exit" title="Log out")
		SVGLogo

//- end
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useRouter, useRoute, RouterLink } from 'vue-router';
import useUserData from '@/store/useUserData';
import useAside from '@/store/useAside';
import SVGLogo from '@/assets/logo.svg?component';
import SVGMenu from '@/assets/menu.svg?component';

export default defineComponent({
	setup () {
		const route = useRoute();
		const router = useRouter();
		const aside = useAside();
		const userData = useUserData();

		const pathToRoot = computed(() => {
			return (route.path !== '/dashboard') ? '/dashboard' : undefined;
		})
		const logoTagName = computed(() => {
			return pathToRoot.value ? 'RouterLink' : 'div';
		})
		function closeSession () {
			userData.closeSession();
			router.push('/login')
		}
		function toggleAside (): void {
			aside.toggleAside();
		}

		return { closeSession, pathToRoot, logoTagName, toggleAside };
	},
	components: { RouterLink, SVGLogo, SVGMenu }
});
</script>

<style lang="stylus" module>
/* Header */
.header
	display flex
	align-items center
	justify-content space-between
	padding 20px 30px 18px
	border-bottom 2px solid var(--gray-100)
	background-color var(--white)

/* Left Side */
.leftSide
	display flex
	align-items center
	gap 30px

/* Logo */
.logo
	font-family: 'Koulen';
	font-size: 38px;
	line-height: 1em;
	letter-spacing: 0.05em;
	&[href]:hover { color: var(--blue-300); }

/* Exit */
.exit
	color var(--black)
	&:hover { color: var(--blue-300); cursor pointer; }
</style>