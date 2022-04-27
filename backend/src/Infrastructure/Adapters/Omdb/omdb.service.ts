import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { OmdbEntry, OmdbSearchResult, OmdbSeason } from './omdb.types';

@Injectable()
export class OmdbService {
  private readonly logger = new Logger(OmdbService.name);

  constructor(private readonly httpService: HttpService) {
    this.logger.log('OmdbService has been initialized');
  }

  async getEntry(id: string) {
    this.logger.log(`Getting entry "${id}".`);
    const params = {
      i: id,
      plot: 'full',
      details: 'full',
    };
    const call = this.httpService.get<OmdbEntry>(`/`, {
      params,
    });
    // convert observable to promise
    const temp = firstValueFrom(call);
    const response = await temp;
    if (response.status !== 200) {
      this.logger.error(`External error while getting entry "${id}".`);
      throw new Error(`Omdb get entry returned status ${response.status}.`);
    }
    const entry = response.data;
    if (entry.Response === 'False') {
      this.logger.warn(`Entry "${id}" not found.`);
      throw new Error(`Entry "${id}" not found.`);
    }
    return entry;
  }

  async getSeason(id: string, seasonNumber: number) {
    this.logger.log(`Getting season "${seasonNumber}" for entry "${id}".`);
    const params = {
      i: id,
      Season: seasonNumber,
    };
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
      throw new Error(`Omdb search returned status ${response.status}.`);
    }
    const season = response.data;
    if (season.Response === 'False') {
      this.logger.warn(`Season "${seasonNumber}" for entry "${id}" not found.`);
      throw new Error(`Season "${seasonNumber}" for entry "${id}" not found.`);
    }
    return season;
  }

  async search(query: string, page: number) {
    if (page < 1) {
      this.logger.error(`Page number must be greater than 0.`);
      throw new Error(`Page number must be greater than 0.`);
    }
    this.logger.log(`Getting page "${page}" for search with query "${query}".`);
    const params = {
      s: query,
      page,
    };
    const call = this.httpService.get<OmdbSearchResult>(`/`, {
      params,
    });
    // convert observable to promise
    const temp = firstValueFrom(call);
    const response = await temp;
    if (response.status !== 200) {
      this.logger.error(`External error while searching for "${query}".`);
      throw new Error(`Omdb search returned status ${response.status}.`);
    }
    const result = response.data;
    if (result.Response === 'False') {
      this.logger.warn(`Page ${page} of search for "${query}" had no results.`);
      throw new Error(`Page ${page} of search for "${query}" had no results.`);
    }
    return result;
  }
}
