import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { WatchlistService } from '../../../../Logic/Services/watchlist.service';
import { userId } from '../../Decorators/userId.decorator';
import { JwtGuard } from '../../Guards/jwt.guard';
import { ErrorsService } from '../../Util/errors.service';
import { CreateItemDto } from '../DTOs/create-watchlist-item.dto';
import { UpdateItemDto } from '../DTOs/update-watchlist-item.dto';

@Controller('watchlist')
@ApiTags('watchlist')
export class WatchlistController {
  public constructor(
    private readonly watchlistService: WatchlistService,
    private readonly errorsService: ErrorsService,
  ) {}

  private readonly logger = new Logger(WatchlistController.name);

  @Get('item')
  public async getWatchlistItem(
    @Query('userId') userId: string,
    @Query('imdbId') imdbId: string,
  ) {
    this.logger.log(
      `An HTTP request to get watchlist item for entry "${imdbId}" for user with "${userId}" was received.`,
    );

    try {
      const item = await this.watchlistService.findItemByImdbIdForUser(
        imdbId,
        userId,
      );
      return item;
    } catch (error) {
      this.errorsService.mapToHTTPError(error);
    }
  }

  @ApiCookieAuth('Authentication')
  @UseGuards(JwtGuard)
  @Post('item')
  public async createItem(
    @userId() id: string,
    @Body() createItemDto: CreateItemDto,
  ) {
    this.logger.log(
      `An HTTP request to create item for entry with imdbId "${createItemDto.imdbId}" for user "${createItemDto.userId}" was received.`,
    );
    try {
      const watchlistItem = await this.watchlistService.create(
        createItemDto.imdbId,
        createItemDto.userId,
        id,
      );
      return watchlistItem;
    } catch (error) {
      this.errorsService.mapToHTTPError(error);
    }
  }

  @ApiCookieAuth('Authentication')
  @UseGuards(JwtGuard)
  @Delete('item/:id')
  public async deleteItem(
    @userId() requesterId: string,
    @Param('id') id: string,
  ) {
    this.logger.log(
      `An HTTP request to delete item with id "${id}" by user "${requesterId}" was received.`,
    );
    try {
      const watchlistItem = await this.watchlistService.delete(id, requesterId);
      return watchlistItem;
    } catch (error) {
      this.errorsService.mapToHTTPError(error);
    }
  }

  @ApiCookieAuth('Authentication')
  @UseGuards(JwtGuard)
  @Patch('item/:id')
  public async updateItem(
    @userId() requesterId: string,
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    this.logger.log(
      `An HTTP request to update item with id "${id}" by user "${requesterId}" was received.`,
    );
    try {
      const watchlistItem = await this.watchlistService.updateItem(
        id,
        requesterId,
        updateItemDto,
      );
      return watchlistItem;
    } catch (error) {
      this.errorsService.mapToHTTPError(error);
    }
  }
}
