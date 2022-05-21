import { v4 as uuidv4} from 'uuid';
import { defineStore } from 'pinia';
import type { MovieData } from '@/types/api/apiMovies';
import type { UserData, PersonalUserData } from '@/types/store/UserData';

const useUserList = defineStore('userList', {
	state: () => ({
		users: [] as UserData[],
	}),

	getters: {
		getUserById (state) {
			/**
			 * Return user data id.
			 **/
			return (id: string): UserData | undefined => {
				const user = state.users.find(el => el.id === id);
				return user ? user : undefined;
			}
		},
		getUser (state) {
			/**
			 * Return user data by login and passord.
			 **/
			return (login: string, password: string): UserData | undefined => {
				const user = state.users.find(el => el.personalData.login === login && el.personalData.password === password);
				return user ? user : undefined;
			}
		},
		getMovie () {
			/**
			 * Get movie data by passing the user ID and movie ID.
			 * @param userId user id.
			 * @param movieId movie id.
			 * @return movie data or undefined.
			 **/
			return (userId: string, movieId: string): MovieData | undefined => {
				const user = this.getUserById(userId);
				return user!.movies.find(el => el.id === movieId);
			}
		},
		getMovieSerialNumber () {
			/**
			 * Get the serial number of the movie in the user's list.
			 * @param userId user id.
			 * @param movieId movie id.
			 * @return serial number of the film.
			 **/
			return (userId: string, movieId: string): number | undefined => {
				const user = this.getUserById(userId);
				return user!.movies.findIndex(el => el.id === movieId);
			}
		}
	},

	actions: {
		/**
		 * Deep data cloning is necessary to break links and prevent data duplication.
		 * @param data user data.
		 * @returns deep clone of the user data.
		 */
		cloneData (data: UserData): UserData {
			return JSON.parse(JSON.stringify(data)) as UserData;
		},
		/**
		 * Uploading data to local storage.
		 * @see {@link Storage}
		 **/
		uploadData (): void {
			const JSONData = localStorage[this.$id];
			if (JSONData) this.$state = JSON.parse(JSONData);
		},
		/**
		 * Getting data from local storage.
		 * @see {@link Storage}
		 **/
		saveData (): void {
			const JSONData = JSON.stringify(this.$state);
			localStorage[this.$id] = JSONData;
		},
		/**
		 * __Authorization group__ \
		 * Registering a new user.
		 * @param id user id.
		 * @param token token.
		 * @see {@link UserData}
		 **/
		async sessionIsRelevance (id: string, token: string): Promise<void> {
			const user = this.getUserById(id);
			if (user?.token !== token)
				throw { code: 401, body: 'The session is outdated.' };
		},
		/**
		 * __Authorization group__ \
		 * Registering a new user.
		 * @param data user data.
		 * @see {@link UserData}
		 **/
		async addUser (data: PersonalUserData): Promise<UserData> {
			// Check user exist:
			if (this.users.find(el => el.personalData.login === data.login))
				throw { code: 409, body: 'A user with such an email is already registered.' };

			const userId = uuidv4();
			const user: UserData = { id: userId, token: 'null', personalData: data, movies: [] };
			this.users.push(user);
			this.saveData();

			// Auth user and return his data:
			return await this.authUserById(userId, 'null');
		},
		/**
		 * __Authorization group__ \
		 * Authorization of the user by his id. The token of the
		 * current session and the token of the last registered
		 * session must match.
		 * @param id user id.
		 **/
		async authUserById (id: string, token: string): Promise<UserData> {
			const user = this.getUserById(id);
			const newToken = uuidv4();

			// Check user exist:
			if (!user)
				throw { code: 404, body: 'User not exist.' };

			// Checking the relevance of the session:
			await this.sessionIsRelevance(id, token);

			user.token = newToken;
			this.saveData();

			// Return user data:
			return this.cloneData(user);
		},
		/**
		 * __Authorization group__ \
		 * Authorization of the user by his login and password.
		 * @param login user login.
		 * @param password user password.
		 **/
		async authUser (login: string, password: string): Promise<UserData> {
			const user = this.getUser(login, password);
			const newToken = uuidv4();

			// Exist match:
			if (!user)
				throw { code: 404, body: 'Invalid username or password.' };

			user.token = newToken;
			this.saveData();

			// Return user data:
			return this.cloneData(user);
		},
		/**
		 * __Change data group__ \
		 * Adding information and a movie to the user.
		 * @param id user id.
		 * @param data movie data.
		 * @returns id of the new movie.
		 **/
		async addMovie (id: string, data: MovieData): Promise<string> {
			const user = this.getUserById(id);

			// Add movie:
			user!.movies.unshift(data);
			this.saveData();

			// Retunr movie id:
			return data.id!;
		},
		/**
		 * __Change data group__ \
		 * Remove a movie from the list.
		 * @param userId user id.
		 * @param movieId movie id.
		 * @returns id of the remove movie.
		 **/
		async removeMovie (userId: string, movieId: string): Promise<string | undefined> {
			const { movies } = this.getUserById(userId)!;
			const movieIndex = this.getMovieSerialNumber(userId, movieId)!;

			// Check movie exist:
			if (!movieIndex === undefined) return undefined;

			// Remove movie:
			movies.splice(movieIndex, 1);
			this.saveData();

			// Retunr movie id:
			return movieId;
		}
	},
});

export default useUserList;