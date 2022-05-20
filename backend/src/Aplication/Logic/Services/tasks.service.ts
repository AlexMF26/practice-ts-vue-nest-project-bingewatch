import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';
import { DeleteOpinionEvent } from '../../../Domain/Events/DeleteOpinion.event';
import { RefreshEntryDataEvent } from '../../../Domain/Events/RefreshEntryData.events';
import { RefreshEntryRatingEvent } from '../../../Domain/Events/RefreshEntryRating.event';
import { EntriesService } from './entries.service';
import { OpinionsService } from './opinions.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  public constructor(
    private readonly eventEmitterService: EventEmitter2,
    private readonly entriesService: EntriesService,
    private readonly opinionsService: OpinionsService,
  ) {}

  @Cron('*/5 * * * *')
  public async refreshEntities() {
    this.logger.log('Refreshing entries...');
    //get all the imdb ids for all entries in the database
    const imdbIds = await this.entriesService.getAllIds();
    //dispatch a event for each imdb id
    imdbIds.forEach(async (imdbId) => {
      this.logger.log(`Dispatching maintenance events for entry ${imdbId}`);
      await this.eventEmitterService.emitAsync(
        RefreshEntryDataEvent.name,
        new RefreshEntryDataEvent(imdbId),
      );
      await this.eventEmitterService.emitAsync(
        RefreshEntryRatingEvent.name,
        new RefreshEntryRatingEvent(imdbId),
      );
    });
    this.logger.log('Refreshing entries done');
  }

  @Cron('*/10 * * * *')
  public async opinionsCleanup() {
    this.logger.log('Checking opinions marked for deletion...');
    //get all the opinions marked for deletion that have not been deleted
    const ids = await this.opinionsService.getPreservedOpinionsIds();
    ids.forEach(async (id) => {
      this.logger.log(`Dispatching maintenance events for opinion ${id}`);
      await this.eventEmitterService.emitAsync(
        DeleteOpinionEvent.name,
        new DeleteOpinionEvent(id),
      );
    });
    this.logger.log('Checking opinions marked for deletion done');
  }
}
