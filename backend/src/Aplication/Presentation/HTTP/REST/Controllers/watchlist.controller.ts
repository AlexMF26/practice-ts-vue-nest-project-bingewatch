import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ServiceUnavailableException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { WatchlistService } from '../../../../Logic/Services/watchlist.service';
import { userId } from '../../Decorators/userId.decorator';
import { JwtGuard } from '../../Guards/jwt.guard';
import { CreateItemDto } from '../DTOs/create-watchlist-item.dto';
import { UpdateItemDto } from '../DTOs/update-watchlist-item.dto';

@Controller('watchlist')
@ApiTags('watchlist')
export class WatchlistController {
  public constructor(private readonly watchlistService: WatchlistService) {}

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
