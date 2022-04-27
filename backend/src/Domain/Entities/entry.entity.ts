import { Entry } from '@prisma/client';

export class EntryEntity implements Entry {
  readonly imdbId: string;
  readonly title: string;
  readonly posterUrl: string;
  readonly rating: number;
  readonly type: EntryType;
  readonly seasons?: Seasons;
  constructor(data: Entry) {
    Object.assign(this, data);
  }
}

export enum EntryType {
  MOVIE = 'MOVIE',
  SERIES = 'SERIES',
}
export type Seasons = { episodes: number }[];
