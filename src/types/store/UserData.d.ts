import { v4 } from 'uuid';
import { MovieData } from '../api/apiMovies';

export interface PersonalUserData {
	readonly login: string,
	password: string,
	firstname: string,
	lastname: string,
	};

export interface UserData {
	readonly id: ReturnType<typeof v4>,
	token: ReturnType<typeof v4>,
	personalData: PersonalUserData,
	movies: MovieData[],
	};