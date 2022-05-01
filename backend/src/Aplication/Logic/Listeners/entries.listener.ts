import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RefreshEntryDataEvent } from '../../../Domain/Events/RefreshEntryData.events';
import { RefreshEntryRatingEvent } from '../../../Domain/Events/RefreshEntryRating.event';
import { EntriesService } from '../Services/entries.service';

@Injectable()
export class EntriesListener {
  private readonly logger = new Logger(EntriesListener.name);

  public constructor(private readonly entriesService: EntriesService) {}

  @OnEvent(RefreshEntryRatingEvent.name)
  public async refreshRating(payload: RefreshEntryRatingEvent) {
    this.logger.log(`Received event: ${RefreshEntryRatingEvent.name}`);
    try {
      return await this.entriesService.refreshData(payload.imdbId);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  @OnEvent(RefreshEntryDataEvent.name)
  public async refreshData(payload: RefreshEntryDataEvent) {
    try {
      return await this.entriesService.refreshRating(payload.imdbId);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
