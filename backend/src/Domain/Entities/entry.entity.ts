import { Entry } from '@prisma/client';

export class EntryEntity implements Omit<Entry, 'seasonsData'> {
  readonly imdbId: string;
  readonly title: string;
  readonly posterUrl: string;
  readonly rating: number;
  readonly seasons?: Season[];

  constructor(data: Entry) {
    const { seasonsData, ...entry } = data;
    Object.assign(this, entry);
    if (seasonsData && seasonsData.length > 0) {
      this.seasons = [];
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

type Season = { episodes: number };
