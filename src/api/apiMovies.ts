import { v4 as uuidv4 } from 'uuid';
import type { MoviesResolve, MovieData } from '@/types/api/apiMovies';

export default async function apiMovies (): Promise<(MovieData)[] | undefined> {
	try {
		const APIURL = import.meta.env.VITE_APIURL;
		const APIKEY = import.meta.env.VITE_APIKEY;
		const header: RequestInit = { method: 'GET', redirect: 'follow' };
		const resolved = await fetch(`${APIURL}/${APIKEY}`, header);
		const { data } = await resolved.json() as MoviesResolve;
		const dataWithIp = data.map(el => { el.id = uuidv4(); return el });
		return dataWithIp;
	} catch (e) {
		alert(e);
	}
}