import { Injectable, Logger } from '@nestjs/common';
import { Entry } from '@prisma/client';
import {
  EntryEntity,
  EntrySearchResult,
} from '../../../Domain/Entities/entry.entity';
import { OpinionEntity } from '../../../Domain/Entities/opinion.entity';
import { OmdbService } from '../../../Infrastructure/Adapters/Omdb/omdb.service';
import { OmdbType } from '../../../Infrastructure/Adapters/Omdb/omdb.types';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';

@Injectable()
export class EntriesService {
  public constructor(
    private readonly repositoryService: RepositoryService,
    private readonly omdbService: OmdbService,
  ) {}

  private readonly logger = new Logger(EntriesService.name);

  public async findReviewsForEntry(entryId: string) {
    this.logger.log(`Finding opinions for entry ${entryId}.`);
    // will throw error if entryId is invalid or entry does not exist
    await this.getEntryByImdbId(entryId);
    try {
      const opinions = await this.repositoryService.opinion.findMany({
        where: {
          entryImdb: entryId,
          replyTo: null,
        },
        include: {
          author: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!opinions) {
        return [];
      }
      return opinions.map((opinion) => new OpinionEntity(opinion));
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  private async getSeason(imdbId: string, seasonNumber: number) {
    const data = await this.omdbService.getSeason(imdbId, seasonNumber);
    if (data === null) {
      return null;
    }
    return data?.Episodes?.length;
  }

  private async getSeasons(imdbId: string) {
    const seasons: number[] = [];
    // get the number of seasons and episodes for each season
    while (true) {
      const season = await this.getSeason(imdbId, seasons.length + 1);
      if (season === null) {
        break;
      }
      seasons.push(season);
    }
    return seasons;
  }

  private async create(imdbId: string): Promise<EntryEntity> {
    const entryData = await this.omdbService.getEntry(imdbId);
    const seasons = await this.getSeasons(imdbId);
    // prepare the update query and execute it
    try {
      const entry = await this.repositoryService.entry.create({
        data: {
          imdbId: entryData.imdbID,
          title: entryData.Title,
          posterUrl: entryData.Poster,
          seasonsData: seasons,
          plot: entryData.Plot,
          rated: entryData.Rated,
          year: entryData.Year,
          awards: entryData.Awards,
          runtime: entryData.Runtime,
          director: entryData.Director.split(', '),
          writer: entryData.Writer.split(', '),
          genre: entryData.Genre.split(', '),
          language: entryData.Language.split(', '),
          actors: entryData.Actors.split(', '),
        },
      });
      return new EntryEntity(entry);
    } catch (error) {
      if (error.message.includes('Unique')) {
        return await this.getEntryByImdbId(imdbId);
      } else {
        this.logger.error(error.message);
        throw error;
      }
    }
  }

  public async getEntryByImdbId(imdbId: string): Promise<EntryEntity> {
    // get the entry from the database
    let data: Entry;
    try {
      data = await this.repositoryService.entry.findUnique({
        where: { imdbId },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
    // if there is no entry create it
    if (!data) {
      const entry = await this.create(imdbId);
      return entry;
    }
    return new EntryEntity(data);
  }

  public async refreshRating(imdbId: string) {
    this.logger.log(`Updating rating for entry with imdbId "${imdbId}".`);
    const entry = await this.getEntryByImdbId(imdbId);
    if (entry === null) {
      this.logger.error(`No entry with imdbId "${imdbId}".`);
      throw new Error('Entry was not found.');
    }
    try {
      // get the review data
      const data = await this.repositoryService.watchlistItem.aggregate({
        where: {
          entryId: imdbId,
          rating: { not: null },
        },
        _avg: { rating: true },
      });
      // if there is no reviews new rating is null
      let newRating: number | null = null;
      // if there are reviews use the average
      if (data?._avg?.rating) {
        newRating = data._avg.rating;
      }
      // update the entry
      const updatedEntry = await this.repositoryService.entry.update({
        where: {
          imdbId: imdbId,
        },
        data: {
          rating: newRating,
        },
      });
      this.logger.log(`Updated rating for entry with imdbId "${imdbId}".`);
      return new EntryEntity(updatedEntry);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async refreshData(imdbId: string) {
    this.logger.log(`Refreshing data for entry with imdbId "${imdbId}".`);
    let entry: Entry;
    try {
      entry = await this.repositoryService.entry.findUnique({
        where: { imdbId },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
    // if there is no entry create it
    if (!entry) {
      const newEntry = await this.create(imdbId);
      return newEntry;
    }
    const data = await this.omdbService.getEntry(imdbId);
    const seasons = await this.getSeasons(imdbId);
    try {
      entry = await this.repositoryService.entry.update({
        data: {
          title: data.Title,
          posterUrl: data.Poster,
          seasonsData: seasons,
          plot: data.Plot,
          rated: data.Rated,
          year: data.Year,
          awards: data.Awards,
          runtime: data.Runtime,
          director: data.Director.split(', '),
          writer: data.Writer.split(', '),
          genre: data.Genre.split(', '),
          language: data.Language.split(', '),
          actors: data.Actors.split(', '),
        },
        where: { imdbId },
      });
      this.logger.log(`Refreshed entry with imdbId "${imdbId}".`);
      return new EntryEntity(entry);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async query(query: string, page: number) {
    this.logger.log(`Querying for "${query}" on page ${page}.`);
    const data = await this.omdbService.search(query, page);
    // if there is no data, return empty array
    if (
      data?.Response === 'False' ||
      data?.totalResults === 0 ||
      data?.Search?.length === 0
    ) {
      this.logger.warn(`No results for query "${query}".`);
      return [];
    }
    //filter out results that are episodes
    const results = data.Search.filter(
      (result) => result.Type !== OmdbType.Episode,
    );
    // map results to fit the needed data
    const output: EntrySearchResult[] = results.map((result) => {
      return new EntrySearchResult({
        imdbId: result.imdbID,
        title: result.Title,
        posterUrl: result.Poster,
      });
    });
    this.logger.log(`Found "${output.length}" results.`);
    return output;
  }

  public async getAllIds() {
    const ids = await this.repositoryService.entry.findMany({
      select: {
        imdbId: true,
      },
    });
    return ids.map((id) => id.imdbId);
  }
}
