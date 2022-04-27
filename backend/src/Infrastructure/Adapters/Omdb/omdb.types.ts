//Omits properties that have type `never`
export type OmitNever<T extends Record<string, unknown>> = {
  [K in keyof T as T[K] extends never ? never : K]: T[K];
};

/*
Constructs a Record type that only includes shared properties between `A` and `B`.
If the value of a key is different in `A` and `B`, `SharedProperties<A,B>`
attempts to choose a type that is assignable to the types of both values.
 */

export type SharedProperties<A, B> = OmitNever<Pick<A & B, keyof A & keyof B>>;

export type Result = 'True' | 'False';

export interface OmdbRating {
  Source: string;
  Value: string;
}

export enum OmdbType {
  Movie = 'movie',
  Series = 'series',
  Episode = 'episode',
}

export interface OmdbSearchResult {
  Search: OmdbSearch[];
  totalResults: number;
  Response: Result;
}

export interface OmdbSearch {
  Title: string;
  Year: number;
  imdbID: string;
  Type: OmdbType;
  Poster: string;
}

export interface OmdbMovie {
  Title: string;
  Year: number;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OmdbRating[];
  Metascore: number;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: OmdbType;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

export interface OmdbSeries {
  Title: string;
  Year: number;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OmdbRating[];
  Metascore: number;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: OmdbType;
  totalSeasons: number;
  Response: Result;
}

export interface EpisodeInSeason {
  Title: string;
  Released: string;
  Episode: number;
  imdbRating: string;
  imdbID: string;
}

export interface OmdbSeason {
  Title: string;
  Season: number;
  totalSeasons: number;
  Episodes: EpisodeInSeason[];
  Response: Result;
}

export interface OmdbEpisode {
  Title: string;
  Year: number;
  Rated: string;
  Released: string;
  Season: number;
  Episode: number;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: OmdbRating[];
  Metascore: number;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  seriesID: string;
  Type: OmdbType;
  Response: string;
}

export type OmdbEntry = SharedProperties<
  SharedProperties<OmdbMovie, OmdbEpisode>,
  OmdbSeries
>;
