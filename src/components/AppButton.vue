<template lang="pug">
//- start
component(:is="is" :class="computedClass")
	slot

//- end
</template>

<script lang="ts">
import { computed, defineComponent, useCssModule } from 'vue';
import type { ButtonStyled } from '@/types/components/AppButton';
import type { HTMLTagNames } from '@/types/helpers/HTMLTagNames';

export default defineComponent({
	props: {
		styled: {
			type: String as ButtonStyled,
			default: 'filled',
		},
		is: {
			type: String as HTMLTagNames,
			default: 'div',
		},
		disabled: {
			type: Boolean,
			default: false,
		}
	},
	setup (props) {
		const style = useCssModule();
		const computedClass = computed(() => [
			style.button,
			style[props.styled],
			{ [style.bordered]: props.styled.includes('bordered') },
			{ [style.disabled]: props.disabled },
		]);

		return { computedClass };
	}
});
</script>

<style lang="stylus" module>
/* Button */
.button
	padding 0.75em 1.15em 0.68em
	border-radius 8px
	font-size 18px
	text-align center
	cursor pointer
	&.disabled { cursor: default; }

/* Styled */
.bordered
	border 3px solid currentColor
	&-white { color: var(--white); }
	&-black { color: var(--black); }
	&:hover { opacity: 0.70; }
	&.disabled { opacity: 0.50; }

.filled
	$to = var(--blue-300)
	$from = var(--blue-200)
	color var(--white)
	background-image linear-gradient(197deg, $from, $to)
	&:hover { background-image: linear-gradient(197deg, $to, $to); }
	&.disabled { background-image: linear-gradient(197deg, var(--blue-100), var(--blue-100)); }
</style>
