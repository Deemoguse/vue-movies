<template lang="pug">
//- start
RouterLink(:to="`/post/${data.id}`" :class="$style.container")
		//- Info -
		div(:class="$style.info")
			h2(:class="$style.title")
				| {{ data.title }}

			div(:class="$style.desc")
				AppScrollArea
					p {{ data.description }}

		AppImg(:src="data.poster" :class="$style.img")

//- end
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { RouterLink } from 'vue-router';
import AppImg from './AppImg.vue';
import AppScrollArea from './AppScrollArea.vue';
import type { MovieData } from '@/types/api/apiMovies';

export default defineComponent({
    props: {
        data: {
            type: Object as PropType<MovieData>,
            required: true
        }
    },
    components: { AppImg, AppScrollArea, RouterLink }
});
</script>

<style lang="stylus" module>
/* Container */
.container
	position relative
	display flex
	border 3px solid #e9eff0
	border-radius 9px
	text-decoration none
	background-color #e9eff0
	box-shadow 0 0 0 var(--gray-100)
	transition 0.5s
	cursor pointer
	overflow hidden

	&:hover
		background-color var(--gray-300)
		box-shadow 8px 8px 30px var(--gray-300)
		transform scale(1.02)

/* Image */
.img
	position absolute
	inset 0
	transition 0.5s
	pointer-events: none;
	z-index 0

	.container:hover &
		filter blur(2px) brightness(0.3);

/* Info */
.info
	display flex
	flex-direction column
	position relative
	padding 20px
	color var(--white)
	z-index 1
	opacity 0
	pointer-events none
	transition 0.5s

	.container:hover &
		opacity 1
		pointer-events auto


/* Title */
.title
	padding-bottom 10px
	border-bottom 1px solid var(--white)
	font-family 'Koulen'
	font-size 24px

/* Description */
.desc
	flex 1
	overflow hidden
	padding-top 13px
	& p { padding-bottom: 5px; }
</style>