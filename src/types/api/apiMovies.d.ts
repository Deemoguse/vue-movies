export interface MovieData {
	id: string,
	readonly crawled_at: string,
	readonly description: string,
	readonly title: string,
	readonly url: string,
	readonly poster: string,
	readonly raw_description: string,
	readonly produced_by: string,
	readonly directed_by: string,
	};

export interface MoviesResolve {
	data: MovieData[],
	status: string,
	};