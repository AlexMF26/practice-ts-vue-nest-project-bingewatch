import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OmdbService {
  private readonly logger = new Logger(OmdbService.name);

  constructor(private readonly httpService: HttpService) {
    this.logger.log('OmdbService has been initialized');
  }

  async getEntry(id: string) {
    const params = {
      i: id,
      plot: 'full',
      details: 'full',
    };
    const call = this.httpService.get(`/`, {
      params,
    });
    // convert observable to promise
    const temp = firstValueFrom(call);
    const response = await temp;
    const entry = response.data;
    return entry;
  }

  async getSeason(id: string, seasonNumber: number) {
    const params = {
      i: id,
      plot: 'full',
      details: 'full',
      Season: seasonNumber,
    };
    const call = this.httpService.get(`/`, {
      params,
    });
    // convert observable to promise
    const temp = firstValueFrom(call);
    const response = await temp;
    const season = response.data;
    return season;
  }

  async getEpisode(id: string, seasonNumber: number, episodeNumber: number) {
    const params = {
      i: id,
      plot: 'full',
      details: 'full',
      Season: seasonNumber,
      Episode: episodeNumber,
    };
    const call = this.httpService.get(`/`, {
      params,
    });
    // convert observable to promise
    const temp = firstValueFrom(call);
    const response = await temp;
    const episode = response.data;
    return episode;
  }

  async search(query: string, page?: number, type?: 'movie' | 'series') {
    const params = {
      s: query,
      page,
      type,
    };
    const call = this.httpService.get(`/`, {
      params,
    });
    // convert observable to promise
    const temp = firstValueFrom(call);
    const response = await temp;
    const result = response.data;
    return result;
  }
}
