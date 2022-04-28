import { Injectable, Logger } from '@nestjs/common';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';

@Injectable()
export class WatchlistService {
  constructor(private readonly repositoryService: RepositoryService) {
    this.logger.log('WatchlistService has been initialized');
  }

  logger = new Logger(WatchlistService.name);
}
