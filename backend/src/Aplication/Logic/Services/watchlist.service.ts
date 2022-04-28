import { Injectable, Logger } from '@nestjs/common';
import { Role } from '../../../Domain/Entities/user.entity';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';

@Injectable()
export class WatchlistService {
  constructor(private readonly repositoryService: RepositoryService) {
    this.logger.log('WatchlistService has been initialized');
  }

  logger = new Logger(WatchlistService.name);

  private async update(
    itemId: string,
    data: Partial<{
      rating: number;
      progress: number;
    }>,
  ) {
    const changes: Partial<{
      rating: number;
      progress: number;
    }> = {};
    if (data?.rating && (data.rating <= 0 || data.rating > 10)) {
      this.logger.warn(`Rating ${data.rating} is out of range`);
      throw new Error('Rating must be between 0 and 10');
    } else {
      changes.rating = data.rating;
    }
    const entry = await this.repositoryService.watchlistItem.findUnique({
      where: {
        id: itemId,
      },
      select: {
        progress: true,
        entry: {
          select: {
            seasonsData: true,
          },
        },
      },
    });
    if (!entry) {
      this.logger.error(`Watchlist item with id ${itemId} not found`);
      throw new Error(`Watchlist item with id ${itemId} not found`);
    }
    const maxProgress = entry.entry.seasonsData.reduce((acc, cur) => {
      return acc + cur;
    }, 0);
    if (
      data?.progress &&
      (data.progress + entry.progress > maxProgress ||
        data.progress + entry.progress < 0)
    ) {
      this.logger.warn(
        `Progress change ${data.progress} is out of range for ${itemId}`,
      );
      throw new Error(
        `Progress change ${data.progress} is out of range for ${itemId}`,
      );
    } else {
      changes.progress = data.progress + entry.progress;
    }
    const updatedEntry = await this.repositoryService.watchlistItem.update({
      where: {
        id: itemId,
      },
      data: changes,
    });
    return updatedEntry;
  }

  async changeItem(
    requesterId: string,
    itemId: string,
    data: Partial<{
      rating: number;
      progress: number;
    }>,
  ) {
    const item = await this.repositoryService.watchlistItem.findUnique({
      where: {
        id: itemId,
      },
      select: {
        user: {
          select: {
            id: true,
            role: true,
          },
        },
      },
    });
    if (item.user.role !== Role.ADMIN && item.user.id !== requesterId) {
      this.logger.error(
        `User ${requesterId} is not allowed to change watchlist item ${itemId}`,
      );
      throw new Error(
        `User ${requesterId} is not allowed to change watchlist item ${itemId}`,
      );
    }
    return await this.update(itemId, data);
  }
}
