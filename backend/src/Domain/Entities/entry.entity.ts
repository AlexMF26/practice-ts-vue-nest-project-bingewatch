import { Entry } from '@prisma/client';

export class EntryEntity implements Omit<Entry, 'seasonsData'> {
  readonly imdbId: string;
  readonly title: string;
  readonly posterUrl: string;
  readonly rating: number;
  readonly seasons: Season[];

  constructor(data: Entry) {
    const { seasonsData, ...entry } = data;
    Object.assign(this, entry);
    this.seasons = [];
    if (seasonsData && seasonsData.length > 0) {
      seasonsData.forEach((seasonData) => {
        this.seasons.push({ episodes: seasonData });
      });
    }
  }
}

export enum EntryType {
  MOVIE = 'MOVIE',
  SERIES = 'SERIES',
}

export type Season = { episodes: number };

export class EntrySearchResult {
  readonly imdbId: string;
  readonly title: string;
  readonly posterUrl: string;
  constructor(data: { imdbId: string; title: string; posterUrl: string }) {
    Object.assign(this, data);
  }
}
