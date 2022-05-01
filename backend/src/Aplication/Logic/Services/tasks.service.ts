import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { RefreshEntryDataEvent } from '../../../Domain/Events/RefreshEntryData.events';
import { RefreshEntryRatingEvent } from '../../../Domain/Events/RefreshEntryRating.event';
import { EntriesService } from './entries.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private eventEmitter: EventEmitter2,
    private readonly entriesService: EntriesService,
  ) {}

  @Cron('*/30 * * * *')
  async refreshEntities() {
    this.logger.log('Refreshing entries...');
    //get all the imdb ids for all entries in the database
    const imdbIds = await this.entriesService.getAllIds();
    //dispatch a event for each imdb id
    imdbIds.forEach(async (imdbId) => {
      this.logger.log(`Dispatching maintenance events for entry ${imdbId}`);
      this.eventEmitter.emit(
        RefreshEntryDataEvent.name,
        new RefreshEntryDataEvent(imdbId),
      );
      this.eventEmitter.emit(
        RefreshEntryRatingEvent.name,
        new RefreshEntryRatingEvent(imdbId),
      );
    });
    this.logger.log('Refreshing entries done');
  }
}
