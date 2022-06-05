/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface EntrySearchResult {
  imdbId: string;
  title: string;
  posterUrl: string;
}

export interface Season {
  episodes: number;
}

export interface EntryEntity {
  imdbId: string;
  title: string;
  posterUrl: string;
  rating: number;
  seasons: Season[];
  plot: string;
  rated: string;
  year: string;
  awards: string;
  runtime: string;
  director: string[];
  writer: string[];
  actors: string[];
  genre: string[];
  language: string[];
}

export interface OpinionEntity {
  id: string;
  authorId: string | null;
  entryImdb: string | null;
  replyToId: string | null;
  text: string | null;
}

export interface AddReviewDto {
  entryId: string;
  text: string;
}

export interface OpinionContentDto {
  text: string;
}

export interface WatchlistItemEntity {
  id: string;
  userId: string;
  entryId: string;
  progress: number;
  rating: number | null;
}

export interface CreateItemDto {
  userId: string;
  imdbId: string;
}

export interface UpdateItemDto {
  /**
   * @min 1
   * @max 10
   * @example 8
   */
  rating?: number;

  /**
   * @min 0
   * @example 123
   */
  progress?: number;
}

export interface DetailedWatchlistItemEntity {
  entry: EntryEntity;
  id: string;
  rating: number | null;
  progress: number;
}

export interface CreateUserDto {
  /**
   * The name of the user.
   * @pattern ^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*.?$
   * @example Ion POPESCU
   */
  name: string;

  /**
   * The email of the user.
   * @pattern (?!.*s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})
   * @example Ion.Popescu@google.com
   */
  email: string;

  /**
   * The password of the user. Must be at least 8 characters long and contain at least one number, one uppercase letter, lowercase letter and one special character.
   * @pattern (?!.*s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})
   * @example P@ssword123
   */
  password: string;
}

export interface SerializedUserEntity {
  id: string;
  role: 'USER' | 'ADMIN';
  name: string;
  email: string;
}

export interface UpdateUserDto {
  /**
   * The name of the user.
   * @pattern ^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*.?$
   * @example Ion POPESCU
   */
  name?: string;

  /**
   * The email of the user.
   * @pattern (?!.*s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})
   * @example Ion.Popescu@google.com
   */
  email?: string;

  /**
   * The role of the user.
   * @example ADMIN
   */
  role?: 'ADMIN' | 'USER';

  /**
   * The password of the user. Must be at least 8 characters long and contain at least one number, one uppercase letter, lowercase letter and one special character.
   * @pattern (?!.*s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})
   * @example P@ssword123
   */
  password?: string;
}

export interface LoginDto {
  /**
   * The email of the user.
   * @pattern [w-.]+@([w-]+.)+[w-]{2,4}$
   * @example Ion.Popescu@google.com
   */
  email: string;

  /**
   * The password of the user. Must be at least 8 characters long and contain at least one number, one uppercase letter, lowercase letter and one special character.
   * @pattern (?!.*s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})
   * @example P@ssword123
   */
  password: string;
}
