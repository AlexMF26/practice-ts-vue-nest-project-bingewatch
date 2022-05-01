import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Query,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EntriesService } from '../../../../Logic/Services/entries.service';

@Controller('entries')
@ApiTags('entries')
export class EntriesController {
  constructor(private readonly entriesService: EntriesService) {}

  private readonly logger = new Logger(EntriesController.name);

  @Post('/search')
  public async query(@Query('query') query: string) {
    this.logger.log(`An HTTP request to search for "${query}" was received.`);

    try {
      const answear = await this.entriesService.query(query, 1);
      return answear;
    } catch (error) {
      if (error.message.includes('found')) {
        throw new NotFoundException(error.message);
      } else if (error.message.includes('given')) {
        throw new BadRequestException(error.message);
      } else if (error.message.includes('authorized')) {
        throw new UnauthorizedException(error.message);
      } else if (error.message.includes('External')) {
        throw new ServiceUnavailableException(error.message);
      } else {
        this.logger.error(error.message);
        throw error;
      }
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
      if (error.message.includes('found')) {
        throw new NotFoundException(error.message);
      } else if (error.message.includes('given')) {
        throw new BadRequestException(error.message);
      } else if (error.message.includes('authorized')) {
        throw new UnauthorizedException(error.message);
      } else if (error.message.includes('External')) {
        throw new ServiceUnavailableException(error.message);
      } else {
        this.logger.error(error.message);
        throw error;
      }
    }
  }
}
