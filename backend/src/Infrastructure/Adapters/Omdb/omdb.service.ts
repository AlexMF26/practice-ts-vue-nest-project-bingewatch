import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OmdbEntry, OmdbSearchResult, OmdbSeason } from './omdb.types';

@Injectable()
export class OmdbService {
  private readonly logger = new Logger(OmdbService.name);

  constructor(private readonly httpService: HttpService) {}

  public async getEntry(id: string) {
    this.logger.log(`Getting entry "${id}".`);
    const params = {
      i: id,
      plot: 'full',
      details: 'full',
    };
    // doing api call
    const call = this.httpService.get<OmdbEntry>(`/`, {
      params,
    });
    // convert observable to promise
    const temp = firstValueFrom(call);
    const response = await temp;
    if (response.status !== 200) {
      this.logger.error(`External error while getting entry "${id}".`);
      throw new Error(
        `External provider OMDB returned status ${response.status}.`,
      );
    }
    const entry = response.data;
    if (entry.Response === 'False') {
      this.logger.warn(`Entry "${id}" not found.`);
      throw new Error('The imdbId entry was not found.');
    }
    this.logger.log(`Found "${id}".`);
    return entry;
  }

  public async getSeason(id: string, seasonNumber: number) {
    this.logger.log(`Getting season "${seasonNumber}" for entry "${id}".`);
    if (Number.isInteger(seasonNumber) === false) {
      this.logger.error('Season number number must be an integer.');
      throw new Error('The given season number page number is not an integer.');
    }
    const params = {
      i: id,
      Season: seasonNumber,
    };
    // doing api call
    const call = this.httpService.get<OmdbSeason>(`/`, {
      params,
    });
    // convert observable to promise
    const temp = firstValueFrom(call);
    const response = await temp;
    if (response.status !== 200) {
      this.logger.error(
        `External error while getting season "${seasonNumber}" for IMDBid "${id}".`,
      );
      throw new Error(
        `External provider OMDB returned status ${response.status}.`,
      );
    }
    const season = response.data;
    if (season.Response === 'False') {
      this.logger.warn(`Season "${seasonNumber}" for "${id}" not found.`);
      return null;
    }
    this.logger.log(
      `Found ${season.Episodes.length} episodes for season "${seasonNumber}" for "${id}".`,
    );
    return season;
  }

  public async search(query: string, page: number) {
    this.logger.log(`Getting page "${page}" for search with query "${query}".`);
    const params = {
      s: query,
      page,
    };
    if (page < 1) {
      this.logger.error('Page number must be greater than 0.');
      throw new Error('The given page number is less than 1.');
    }
    if (Number.isInteger(page) === false) {
      this.logger.error('Page number must be an integer.');
      throw new Error('The given page number is not an integer.');
    }
    //check if the query doesn't contains something else than spaces
    if (query.trim().length === 0) {
      this.logger.error('Search query must not be empty.');
      throw new Error('The given search query is empty.');
    }
    // doing api call
    const call = this.httpService.get<OmdbSearchResult>(`/`, {
      params,
    });
    // convert observable to promise
    const temp = firstValueFrom(call);
    const response = await temp;
    if (response.status !== 200) {
      this.logger.error(`External error while searching for "${query}".`);
      throw new Error(
        `External provider OMDB returned status ${response.status}.`,
      );
    }
    const result = response.data;
    this.logger.log(`Found ${result.totalResults} results for "${query}".`);
    return result;
  }
}
