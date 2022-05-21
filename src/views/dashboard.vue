<template lang="pug">
//- start
div(:class="$style.container")
	AppScrollArea
		div(:class="$style.grid")
			DashboardCardPlaceholder(v-for="number in queue" :key="number" :class="$style.placeholder")
			DashboardCard(v-for="movie in movies" :data="movie" :key="movie.url")

//- end
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import AppBox from '@/components/AppBox.vue';
import AppScrollArea from '@/components/AppScrollArea.vue';
import useUserData from '@/store/useUserData';
import useQueue from '@/store/useQueue';
import DashboardCard from '@/components/DashboardCard.vue';
import AppSpinner from '@/components/AppSpinner.vue';
import DashboardCardPlaceholder from '@/components/DashboardCardPlaceholder.vue';

export default defineComponent({
	setup () {
		const queue = useQueue();
		const { queueValue } = storeToRefs(queue)
		const userData = useUserData();

		return {
			movies: userData.data.movies,
			queue: queueValue
		}
	},
	components: { RouterLink, AppBox, AppScrollArea, DashboardCard, AppSpinner, DashboardCardPlaceholder }
});
</script>

<style lang="stylus" module>
/* Container */
.container
	position relative

	&:before
		content ''
		position absolute
		inset 0
		box-shadow inset 0 0 5px 1px rgba(0, 0, 0, 0.15), 6px 6px 20px rgba(0, 0, 0, 0.15)
		z-index 1
		pointer-events none

/* Grid */
.grid
	display grid
	grid-template-columns repeat(auto-fill, minmax(250px, 1fr))
	gap 30px
	padding 30px

	& > *
		aspect-ratio 1 / 1.25

</style>