import { Entry } from '@prisma/client';

export class EntryEntity implements Omit<Entry, 'seasonsData'> {
  public readonly imdbId: string;
  public readonly title: string;
  public readonly posterUrl: string;
  public readonly rating: number;
  public readonly seasons: Season[];
  public readonly plot: string;
  public readonly rated: string;
  public readonly director: string;
  public readonly year: string;
  public readonly awards: string;
  public readonly runtime: string;
  public readonly writer: string[];
  public readonly actors: string[];
  public readonly genre: string[];
  public readonly language: string[];

  public constructor(data: Entry) {
    const { seasonsData, ...entry } = data;
    Object.assign(this, entry);
    this.seasons = [];
    if (seasonsData && seasonsData.length > 0) {
      seasonsData.forEach((seasonData) => {
        this.seasons.push(new Season(seasonData));
      });
    }
  }
}

export class Season {
  public readonly episodes: number;

  constructor(episodes: number) {
    this.episodes = episodes;
  }
}

export class EntrySearchResult {
  public readonly imdbId: string;
  public readonly title: string;
  public readonly posterUrl: string;

  public constructor(data: {
    imdbId: string;
    title: string;
    posterUrl: string;
  }) {
    Object.assign(this, data);
  }
}
