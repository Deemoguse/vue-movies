<template lang="pug">
//- start
component(:is="is" :class="$style.logo")
	slot

//- end
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { HTMLTagNames } from '@/types/helpers/HTMLTagNames';

export default defineComponent({
	props: {
		is: {
			type: String as HTMLTagNames,
			default: 'div',
		},
	}
})
</script>

<style lang="stylus" module>
/* logo */
.logo
	display flex
	gap 25px
	align-items center
	font-family 'Koulen'
	font-size 52px
	line-height 1em
	letter-spacing 0.050em

	&::before, &::after
		content ''
		display block
		flex 1
		height 3px
		background-color var(--black)
		transform translateY(-3px)
</style>