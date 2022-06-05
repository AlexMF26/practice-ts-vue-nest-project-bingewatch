import { Controller, Get, Logger, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntriesService } from '../../../../Logic/Services/entries.service';
import { HTTPErrorsService } from '../../Util/httpErrors.service';

@Controller('entries')
@ApiTags('entries')
export class EntriesController {
  public constructor(
    private readonly entriesService: EntriesService,
    private readonly errorsService: HTTPErrorsService,
  ) {}

  private readonly logger = new Logger(EntriesController.name);

  @Post('/search')
  public async query(@Query('query') query: string) {
    this.logger.log(`An HTTP request to search for "${query}" was received.`);

    try {
      const answear = await this.entriesService.query(query, 1);
      return answear;
    } catch (error) {
      this.errorsService.mapToHTTPError(error);
    }
  }

  @Get(':id')
  public async get(@Param('id') imdbId: string) {
    this.logger.log(
      `An HTTP request to get entry with imdbId "${imdbId}" was received.`,
    );

    try {
      const entry = await this.entriesService.getEntryByImdbId(imdbId);
      return entry;
    } catch (error) {
      this.errorsService.mapToHTTPError(error);
    }
  }

  @Get('/:id/reviews')
  public async getReviews(@Param('id') imdbId: string) {
    this.logger.log(
      `An HTTP request to get entry with imdbId "${imdbId}" was received.`,
    );

    try {
      const reviews = await this.entriesService.findReviewsForEntry(imdbId);
      return reviews;
    } catch (error) {
      this.errorsService.mapToHTTPError(error);
    }
  }
}
