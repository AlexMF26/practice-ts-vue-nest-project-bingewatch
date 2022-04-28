import { Injectable, Logger } from '@nestjs/common';
import { OmdbService } from '../../../Infrastructure/Adapters/Omdb/omdb.service';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';

@Injectable()
export class EntriesService {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly omdbService: OmdbService,
  ) {
    this.logger.log('EntriesService has been initialized');
  }

  logger = new Logger(EntriesService.name);
}
