import { MovieData } from '@/types/api/apiMovies';
import { UserData } from '@/types/store/UserData';
import { defineStore } from 'pinia';

const useUserData = defineStore('UserData', {
	state: () => ({
		auth: false,
		data: {} as UserData,
	}),

	getters: {
		getMovie (state) {
			/**
			 * Get movie data by passing the movie ID.
			 * @param id movie id.
			 * @return movie data or undefined.
			 **/
			return (id: string): MovieData | undefined => {
				return state.data.movies.find(el => el.id === id);
			}
		},
		getMovieSerialNumber (state) {
			/**
			 * Get the serial number of the movie in the user's list.
			 * @param id movie id.
			 * @return serial number of the film.
			 **/
			return (id: string): number | undefined => {
				return state.data.movies.findIndex(el => el.id === id);
			}
		}
	},

	actions: {
		/**
		 * __Authorization group__ \
		 * Assigning authorized user data.
		 * @param user user data.
		 * @returns user id.
		 **/
		async setUser (user: UserData | undefined): Promise<string | void> {
			if (!user) return;
			this.auth = true;
			this.data = user;

			// Set local session data:
			localStorage.setItem('userId', user.id);
			localStorage.setItem('token', user.token);

			// Resturn user actual token:
			return user.id;
		},
		/**
		 * __Authorization group__ \
		 * Closing the session, resetting user data and token.
		 **/
		async closeSession (): Promise<void> {
			this.auth = false;
			this.data = {} as UserData;

			// Remove local session data:
			localStorage.removeItem('userId');
			localStorage.removeItem('token');
		},
		/**
		 * __Change data group__ \
		 * Adding information and a movie to the user.
		 * @param data movie data.
		 * @returns id of the new movie.
		 **/
		async addMovie (data: MovieData): Promise<string> {
			this.data!.movies.unshift(data);
			return data.id!;
		},
		/**
		 * __Change data group__ \
		 * Remove a movie from the list.
		 * @param id movie id.
		 * @returns id of the remove movie.
		 **/
		async removeMovie (id: string): Promise<string | undefined> {
			const movies = this.data.movies;
			const movieIndex = this.getMovieSerialNumber(id)!;

			// Check movie exist:
			if (!movieIndex === undefined) return undefined;

			// Delete movie:
			movies.splice(movieIndex, 1);
		}
	}
});

export default useUserData;