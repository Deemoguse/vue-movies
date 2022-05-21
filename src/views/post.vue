<template lang="pug">
//- start
AppScrollArea(v-if="data" :class="$style.container")
	div(:class="$style.header")
		AppImg(:src="data.poster" :class="$style.img" :key="key")

		div(:class="$style.info")
			AppDecorationTitle(:is="'h1'" :class="$style.title")
				| {{ data.title }}

			template(v-if="data.crawled_at !== 'na' && data.crawled_at !== undefined")
				h2(:class="$style.tagline")
					| Crawled
				div(:class="$style.text")
					| {{ data.crawled_at }}

			template(v-if="data.directed_by !== 'na' && data.directed_by !== undefined")
				h2(:class="$style.tagline")
					| Directed By
				div(:class="$style.text")
					| {{ data.directed_by }}

			template(v-if="data.produced_by !== 'na' && data.produced_by !== undefined")
				h2(:class="$style.tagline")
					| Produced By
				div(:class="$style.text")
					| {{ data.produced_by }}

			template(v-if="data.description !== 'na' && data.description !== undefined")
				h2(:class="$style.tagline")
					| Description
				div(:class="$style.text")
					| {{ data.description }}


//- end
</template>

<script lang="ts">
import { defineComponent, onMounted, onUpdated, ref } from 'vue';
import { useRoute } from 'vue-router';
import useUserData from '@/store/useUserData';
import AppDecorationTitle from '@/components/AppDecorationTitle.vue';
import AppImg from '@/components/AppImg.vue';
import AppScrollArea from '@/components/AppScrollArea.vue';
import { MovieData } from '@/types/api/apiMovies';

export default defineComponent({
	setup() {
		const route = useRoute();
		const userData = useUserData();
		const data = ref<MovieData>();
		const key = ref<string>();

		function updateData (): void {
			key.value = route.params.id as string;
			data.value = userData.getMovie(route.params.id as string);
		}

		onMounted(updateData);
		onUpdated(updateData);

		return { data, key };
	},
	components: { AppImg, AppScrollArea, AppDecorationTitle }
});
</script>

<style lang="stylus" module>
/* Container */
.container
	padding 30px

/* Header */
.header
	display flex
	gap 40px

	@media screen and (max-width: 660px)
		flex-direction column

/* Img */
.img
	aspect-ratio 1 / 1.25
	max-width 360px
	border-radius 9px

	@media screen and (max-width: 660px)
		margin 0 auto

/* Info */
.info
	width 100%

/* Title */
.title:before
	display none

/* Tagline */
.tagline
	margin-top 20px
	font-size 24px
	font-weight bold

/* Text */
.text
	margin-top 10px
	line-height 1.4
	letter-spacing -0.015em

/* Data */
.data
	color red

/* Directed */
.directed
	color red

/* Produced */
.produced
	color red

/* Description */
.description
	color red

</style>