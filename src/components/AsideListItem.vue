<template lang="pug">
//- start
RouterLink(v-slot="{ isActive }" :to="`/post/${id}`" :class="$style.routerList")
	li(
		:class="[$style.container, {[$style.active]: isActive}]"
		@mouseenter="onEnter"
		@mouseleave="onLeave"
	)
		//- Marquee -
		component(
			ref="marquee"
			:class="$style.marquee"
			:is="overflow ? 'AppMarqueeText' : 'div'"
			:paused="marqueePause"
			:key="marqueeKey"
			:duration="5"
		)
			div(:class="$style.title")
				p {{ title }} {{ overflow ? '&nbsp;'.repeat(8) : '' }}

		//- Control panel -
		div(:class="$style.control")
			button(title="Delete Movie" :class="$style.delete" @click="onDelete")
				SVGCross

//- end
</template>

<script lang="ts">
import { defineComponent, ref, nextTick, watch } from 'vue';
import { RouterLink } from 'vue-router';
import AppMarqueeText from 'vue-marquee-text-component';
import SVGCross from '@/assets/cross.svg?component';
import useAside from '@/store/useAside';
import { storeToRefs } from 'pinia';

export default defineComponent({
	emits: ['delete'],
	props: {
		title: {
			type: String,
			required: true,
		},
		id: {
			type: String,
			required: true,
		}
	},
	setup (_, { emit }) {
		const aside = useAside();
		const asideRef = storeToRefs(aside);
		const marquee = ref<HTMLElement>();
		const marqueeKey = ref<number>(0);
		const marqueePause = ref<boolean>(true);
		const enter = ref<boolean>(false);
		const overflow = ref<boolean>(false);

		function onEnter (): void {
			enter.value = true;
			marqueePause.value = false;
			if (!overflow) return;
		}
		function onLeave (): void {
			enter.value = false;
			marqueePause.value = true;
			if (!overflow) return;
			marqueeKey.value += 1;
		}
		function onDelete (event: Event): void {
			event.preventDefault();
			emit('delete');
		}
		function calcOverflow (): void {
			overflow.value = marquee.value!.clientWidth < marquee.value!.scrollWidth;
		}

		// Determining the scroll width after drawing the element:
		nextTick(calcOverflow);

		return {
			marquee,
			marqueeKey,
			marqueePause,
			overflow,
			onEnter,
			onLeave,
			onDelete
		};
	},
	components: { AppMarqueeText, SVGCross, RouterLink }
});
</script>

<style lang="stylus" module>
/* Router List */
.routerList
	text-decoration none

/* Container */
.container
	position relative
	color var(--gray-300)
	overflow hidden
	cursor pointer

	&:hover
		color var(--black)

	&.active
		font-weight bold
		color var(--black)

/* Marquee */
.marquee
	padding 25px 30px

/* Title */
.title
	width max-content
	font-size 22px
	letter-spacing -0.01em

/* Control */
.control
	position absolute
	inset 0 0 auto auto
	display flex
	align-items center
	justify-content flex-end
	padding-right 10px
	height 100%
	padding-left 90px
	background-image linear-gradient(to right, transparent, var(--white) 60%)
	opacity 0
	points-event none
	transition 0.5s

	.container:hover &
		opacity 1

/* Delete */
.delete
	position relative
	padding 5px
	border-radius 50%
	color var(--gray-300)
	background-color var(--gray-50)
	box-shadow inset 0 0 0 0 var(--gray-50)
	transition 0.5s

	&:hover
		color var(--white)
		box-shadow inset 0 0 0 18px var(--red-200)

</style>