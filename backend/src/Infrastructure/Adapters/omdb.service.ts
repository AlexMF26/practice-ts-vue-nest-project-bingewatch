import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OmdbService {
  private readonly logger = new Logger(OmdbService.name);

  constructor(private readonly httpService: HttpService) {
    this.logger.log('OmdbService has been initialized');
  }

  async getMovie(id: string) {
    const params = {
      i: id,
    };
    const call = this.httpService.get(`/`, {
      params,
    });
    // convert observable to promise
    const temp = firstValueFrom(call);
    const response = await temp;
    const movie = response.data;
    return movie;
  }
}
