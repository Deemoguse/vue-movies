<template lang="pug">
//- start
div(:class="$style.wrapper")
	div(:class="$style.header")
		AppHeader

	div(:class="[$style.aside, {[$style.hideAside]: !asideOpen}]")
		AppAside

	div(:class="$style.main")
		slot

//- end
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppHeader from '@/components/AppHeader.vue';
import AppAside from '@/components/AppAside.vue';
import useAside from '@/store/useAside';
import { storeToRefs } from 'pinia';

export default defineComponent({
	setup () {
		const aside = useAside();
		const { open: asideOpen } = storeToRefs(aside);
		return { asideOpen };
	},
	components: { AppHeader, AppAside }
});
</script>

<style lang="stylus" module>
/* Wrapper */
.wrapper
	position relative
	display grid
	grid-template-rows min-content calc(100% - 76px)
	grid-template-columns auto 1fr
	height 100vh

	@media screen and (max-width: 660px)
		grid-template-columns 1fr

/* Header */
.header
	grid-row 1
	grid-column 2 span

/* Aside */
.aside
	grid-row 2
	grid-column 1
	width: 315px
	transition 0.5s

	@media screen and (max-width: 660px)
		position absolute
		inset 0 auto 0 0
		z-index 1

		&:before
			position absolute
			content ''
			height 100%
			width 100vw
			background-color rgba(#000, 0.75)
			z-index -1

	&.hideAside
		width 0
		opacity 0

		&:before
			display none

	& > * { height: 100%; }

/* Main */
.main
	grid-row 2
	grid-column 2
	& > * { height: 100%; }
</style>