<template lang="pug">
//- start
aside(:class="$style.aside")
	AppScrollArea(:class="$style.content")
		ul(v-if="movies.length || queueValue" :class="$style.list")
			li(v-for="number in queueValue" :key="number" :class="$style.loader")
				| Loading...
			AsideListItem(
				v-for="movie in movies"
				:key="movie.id"
				:id="movie.id"
				:title="movie.title"
				@delete="deleteMovie(movie.id)"
			)

	AppButton(is="button" :class="$style.button" @click="addMovie")
		| Add Movie
//- end
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import random from 'random-number';
import AppButton from './AppButton.vue';
import AppScrollArea from './AppScrollArea.vue';
import AsideListItem from './AsideListItem.vue';
import useUserList from '@/store/useUserList';
import useUserData from '@/store/useUserData';
import useQueue from '@/store/useQueue';
import apiMovies from '@/api/apiMovies';

export default defineComponent({
	setup () {
		const route = useRoute();
		const router = useRouter();
		const queue = useQueue();
		const userList = useUserList();
		const userData = useUserData();
		const { data } = storeToRefs(userData);
		const { queueValue } = storeToRefs(queue);

		async function addMovie (): Promise<void> {
			queue.increment();
			const movies = await apiMovies();
			const randomNumber = random({ min: 1, max: 250, integer: true });
			const movie = movies![randomNumber];
			await userData.addMovie(movie);
			await userList.addMovie(userData.data.id, movie);
			queue.decrement();
		}
		async function deleteMovie (id: string): Promise<void> {
			await userList.removeMovie(userData.data.id, id);
			await userData.removeMovie(id);
			if (id === route.params.id) router.push('/dashboard');
		}

		return {
			movies: data.value.movies,
			queueValue,
			addMovie,
			deleteMovie,
		};
	},
	components: { AppButton, AppScrollArea, AsideListItem }
});
</script>

<style lang="stylus" module>
/* Aside */
.aside
	display flex
	flex-direction column
	justify-content space-between
	background-color var(--white)
	overflow hidden

/* Content */
.content
	flex 1
	border-right 2px solid var(--gray-100)

/* Button */
.button
	min-width max-content
	border-radius 0
	font-size 24px
	font-family 'Koulen'

/* Loader */
.loader
	padding 25px 30px
	font-size 22px
	letter-spacing -0.01em
	color var(--gray-200)

</style>