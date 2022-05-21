<template lang="pug">
//- start
div(ref="container" :class="$style.container")
	//- Content wrap -
	div(
		ref="contentRef"
		:class="[$style.content, {[$style.scrollbarActive]: showScrollbar}]"
		@wheel="scrollContent"
		@touchstart="setTouchPoint"
		@touchmove="touchMoveContent"
	): slot

	//- Scrollbar -
	div(:class="[$style.scrollbar, {[$style.grab]: thumbGrab}]" :hidden="!showScrollbar")
		//- Scroll up button-
		button(@click="scrollContentUp" :class="$style.button" title="Scroll Up")

		//- Track and thumb -
		div(
			ref="trackRef"
			:class="$style.thumpTrack"
			@mousedown="grabThumb"
			@mouseup="thumbGrab = false"
		)
			button(
				ref="thumbRef"
				:class="$style.thumb"
				:style="`height: ${thumbSize}px; transform: translateY(${thumbPos}px)`"
				@keydown="thumbPressArrow"
			)

		//- Scroll down button
		button(@click="scrollContentDown" :class="$style.button" title="Scroll Down")

//- end
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, onUpdated, ref } from 'vue';

export default defineComponent({
	setup () {
		const thumbPos = ref<number>(0);
		const thumbSize = ref<number>(0);
		const thumbGrab = ref<boolean>(false);
		const showScrollbar = ref<boolean>(true);
		const trackRef = ref<HTMLElement>();
		const thumbRef = ref<HTMLElement>();
		const contentRef = ref<HTMLElement>()

		/**
		 * Helper for getting access to refs.
		 **/
		function getRefs () {
			return {
				track: trackRef.value as HTMLElement,
				thumb: thumbRef.value as HTMLElement,
				content: contentRef.value as HTMLElement,
			}
		}
		/**
		 * Checking the height of the content relative to the height
		 * of the container to enable or disable the scroll bar.
		 **/
		function sizeTest (): void {
			const { content } = getRefs();
			showScrollbar.value = content.scrollHeight > content.clientHeight;
		}
		/**
		 * Calculation of the thumb position inside the track.
		 **/
		function calcThumbPos (): void {
			if (!showScrollbar.value) return;
			const { content, thumb, track } = getRefs();
			const passedDistance = content.scrollTop / (content.scrollHeight - content.clientHeight) * 100;
			const thumbOffset = thumb.clientHeight / 100 * passedDistance;
			const newThumbPos = (track.clientHeight / 100 * passedDistance) - thumbOffset;
			thumbPos.value = newThumbPos;
		}
		/**
		 * Сalculate the height of the box relative to the height of the scroll to the container.
		 **/
		function calcThumbHeight (): void {
			const { content, track } = getRefs();
			const ratio = content.clientHeight / content.scrollHeight * 100;
			const newThumbSize = track.clientHeight / 100 * ratio;
			thumbSize.value = Math.max(30, newThumbSize);
		}
		/**
		 * Content Scroll handler.
		 **/
		function scrollContent (event: WheelEvent): void {
			const { content } = getRefs();
			const { scrollTop } = content;

			// Preventing the scroll event from surfacing:
			const scrollEnd = content.scrollHeight - content.clientHeight;
			if ((scrollTop > 0 && event.deltaY < 0) || (scrollTop < scrollEnd && event.deltaY > 0))
				event.stopImmediatePropagation();

			if (!showScrollbar.value) return;
			content.scrollTo({ top: scrollTop + event.deltaY });
			calcThumbPos();
		}
		/**
		 * Scroll content up:
		 **/
		function scrollContentUp (event: MouseEvent | KeyboardEvent): void {
			// @ts-ignore The function should be triggered by pressing the left button or the up arrow:
			if (!showScrollbar.value && (event.button !== 0 || event.key !== 'ArrowUp')) return;
			const { content } = getRefs();
			content.scrollTo({ top: content.scrollTop - 100 });
			calcThumbPos();
		}
		/**
		 * Scroll content down:
		 **/
		function scrollContentDown (event: MouseEvent | KeyboardEvent): void {
			// @ts-ignore The function should be triggered by pressing the left button or the down arrow:
			if (!showScrollbar.value && (event.button !== 0 || event.key !== 'ArrowDown')) return;
			const { content } = getRefs();
			content.scrollTo({ top: content.scrollTop + 100 });
			calcThumbPos();
		}

		// Initial touch position:
		const touchStart = ref<number>(0);
		/**
		 * Determination of the initial position for further calculation:
		 **/
		function setTouchPoint (event: TouchEvent): void {
			const { content } = getRefs();
			const target = event.currentTarget as HTMLElement;
			const contentOffset = target.getBoundingClientRect().top;
			const touchPos = Math.min(target.clientHeight, Math.max(0, event.touches[0].clientY - contentOffset));
			touchStart.value = touchPos + content.scrollTop;
		}
		/**
		 * Scrolling content by touch.
		 **/
		function touchMoveContent (event: TouchEvent): void {
			const { content } = getRefs();
			const target = event.currentTarget as HTMLElement;
			const contentOffset = target.getBoundingClientRect().top;
			const touchPos = event.touches[0].clientY - contentOffset;

			content.scrollTo({ top: touchStart.value - touchPos });
			calcThumbPos();
		}
		/**
		 * Scroll content by clicking arrows with thumb focus:
		 **/
		function thumbPressArrow (event: KeyboardEvent) {
			if (event.key === 'ArrowUp') scrollContentUp(event as MouseEvent & KeyboardEvent);
			if (event.key === 'ArrowDown') scrollContentDown(event as MouseEvent & KeyboardEvent)
		}
		/**
		 * Add new mouse movement listeners for `window`
		 **/
		function grabThumb (event: MouseEvent): void {
			// The function will be executed only if the left mouse button was pressed:
			if (event.button !== 0) return;

			window.addEventListener('mousemove', moveThumb);
			window.addEventListener('mouseup', dropThumb);

			// Assigning document styles to prevent side effects:
			document.body.style.setProperty('user-select', 'none');

			moveThumb(event);
			thumbGrab.value = true;
		}
		/**
		 * Remove mouse movement listeners in `window`.
		 **/
		function dropThumb (): void {
			window.removeEventListener('mousemove', moveThumb);
			window.removeEventListener('mouseup', dropThumb);

			// Removing unnecessary document styles:
			document.body.style.userSelect = '';

			thumbGrab.value = false;
		}
		/**
		 * determining the position of the slider relative to the cursor position on the screen.
		 **/
		function moveThumb (event: MouseEvent): void {
			const { thumb, track, content } = getRefs();
			const padding = thumb.clientHeight / 2;
			const trackOffsetTop = event.y - track.getBoundingClientRect().top;
			const offsetY = Math.min(track.clientHeight, Math.max(padding, trackOffsetTop));
			const offsetInProcent = (offsetY - padding) / (track.clientHeight - padding * 2) * 100;
			content.scrollTo({ top: (content.scrollHeight - content.clientHeight) / 100 * offsetInProcent });
			calcThumbPos();
		}
		/**
		 * Repeated size check and thumb position determination.
		 **/
		function windowOnResize (): void {
			sizeTest();
			if (!showScrollbar) return;
			calcThumbPos();
		}

		// Add event listeners for window:
		onMounted(() => {
			sizeTest();
			calcThumbPos();
			calcThumbHeight();
			window.addEventListener('resize', windowOnResize)
		});
		// Remove event listeners on unmounted
		onUnmounted(() => {
			window.removeEventListener('resize', windowOnResize)
		});
		// Recalc thumb possition on update:
		onUpdated(() => {
			sizeTest();
			calcThumbHeight();
			calcThumbPos();
		});

		return {
			showScrollbar,
			thumbPos,
			thumbSize,
			trackRef,
			thumbRef,
			thumbGrab,
			contentRef,
			scrollContent,
			grabThumb,
			touchMoveContent,
			setTouchPoint,
			scrollContentUp,
			scrollContentDown,
			thumbPressArrow,
		};
	}
});
</script>

<style lang="stylus" module>
/* Container */
.container
	position relative
	height 100%
	width 100%
	overflow hidden

/* Content */
.content
	height 100%
	width 100%
	overflow hidden
	box-sizing border-box

	&.scrollbarActive
		padding-right 20px

/* Scrollbar */
.scrollbar
	position absolute
	inset 0 0 0 auto
	display flex
	flex-direction column
	padding 7px 5px 9px
	transition 0.5s

/* Track */
.thumpTrack
	position relative
	flex 1
	width 100%
	margin 6px 0

/* Thumb */
.thumb
	overflow hidden
	position absolute
	top 0
	right 0
	width 100%
	border-radius 10px
	transition 0.5s, transform 0s, height 0s
	background-color var(--blue-200)

	&:before
		content ''
		position absolute
		top 50%
		left 50%
		transform translate(-50%, -50%)
		display block
		width 101%
		height 101%
		border-radius 10px
		background-color var(--gray-200)
		transition 0.25s

	.scrollbar.grab &:before
	.scrollbar:hover &:before
		width 0
		height 0
		background-color var(--gray-300)
		opacity 0

	&:active
		background-color var(--blue-300)
		transition 0s

		&:before
			background-color var(--white) !important
			transition 0s

/* Button */
.button
	position relative
	overflow hidden
	display flex
	align-items center
	justify-content center
	width 8px
	height 8px
	border-radius 50%
	transition: 0.5s
	background-color var(--blue-200)

	&:before
		content ''
		position absolute
		top 50%
		left 50%
		transform translate(-50%, -50%)
		display block
		width 101%
		height 101%
		border-radius 10px
		background-color var(--gray-200)
		transition 0.25s

	.scrollbar.grab &:before
	.scrollbar:hover &:before
		width 0
		height 0
		background-color var(--gray-300)
		opacity 0

	&:hover:active
		background-color var(--blue-300)
		box-shadow 0 0 0 1px var(--blue-300)
		transition 0s

		&:before
			background-color var(--white)
			transition 0s

</style>