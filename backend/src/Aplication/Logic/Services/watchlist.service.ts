import { Injectable, Logger } from '@nestjs/common';
import { WatchlistItemEntity } from '../../../Domain/Entities/watchlist.entity';
import {
  WatchlistEntriesEntity,
  WatchlistEntryItemEntity,
} from '../../../Domain/Entities/watchlistEntry.entity';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';
import { EntriesService } from './entries.service';
import { UsersService } from './users.service';

@Injectable()
export class WatchlistService {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly usersService: UsersService,
    private readonly entriesService: EntriesService,
  ) {}

  logger = new Logger(WatchlistService.name);

  private async create(entryId: string, userId: string, requesterId: string) {
    this.logger.log(
      `Creating item for entry "${entryId}" in the watchlist of user "${userId}"`,
    );
    if (entryId !== requesterId) {
      this.logger.error(
        `User with id "${requesterId}" tried to add entry with id "${entryId}" to the watchlist of user "${userId}"`,
      );
      throw new Error(
        'You are not authorized add entries to other users watchlist.',
      );
    }
    const existentItem = await this.findItemByImdbIdForUser(entryId, userId);
    if (existentItem) {
      this.logger.error(
        `Item for entry "${entryId}" in the watchlist of user "${userId}" already exists`,
      );
      throw new Error(
        `The given entry is already in the watchlist of user "${userId}"`,
      );
    }
    try {
      const newItem = await this.repositoryService.watchlistItem.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          entry: {
            connect: {
              imdbId: entryId,
            },
          },
        },
      });
      return newItem;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async delete(id: string, requesterId: string) {
    this.logger.log(`Deleting item with id "${id}"`);
    try {
      const item = await this.repositoryService.watchlistItem.findUnique({
        where: { id },
      });
      if (!item) {
        this.logger.error(`Item with id "${id}" was not found.`);
        throw new Error('The item was not found.');
      }
      if (item.userId !== requesterId) {
        this.logger.error(
          `User with id "${requesterId}" tried to delete item with id "${id} from the watchlist of user "${item.userId}"`,
        );
        throw new Error(
          'You are not authorized delete entries from other users watchlist.',
        );
      }
      const deletedItem = await this.repositoryService.watchlistItem.delete({
        where: { id },
      });
      return new WatchlistItemEntity(deletedItem);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async findItemByImdbIdForUser(imdbId: string, userId: string) {
    this.logger.log(
      `Getting item for entry "${imdbId}" in the watchlist of user "${userId}"`,
    );
    const entry = await this.entriesService.getEntryByImdbId(imdbId);
    if (!entry) {
      this.logger.warn(`Entry with imdbId "${imdbId}" not found`);
      throw new Error(`Entry with imdbId "${imdbId}" not found`);
    }
    const user = await this.usersService.findById(userId);
    if (!user) {
      this.logger.warn(`User with id "${userId}" not found`);
      throw new Error(`User with id "${userId}" not found`);
    }
    try {
      const item = await this.repositoryService.watchlistItem.findFirst({
        where: {
          userId,
          entryId: imdbId,
        },
      });
      if (!item) {
        this.logger.log(
          `Item for entry "${imdbId}" in the watchlist of user "${userId}" not found`,
        );
        return null;
      }
      return item;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async getWatchlistEntries(userId: string) {
    this.logger.log(`Getting watchlist for user with id "${userId}".`);
    const user = await this.usersService.findById(userId);
    // if the user doesn't exist
    if (!user) {
      this.logger.warn(`User with id "${userId}" was not found.`);
      throw new Error('The user was not found.');
    }
    // get the watchlist( and the entrydata) for the user
    try {
      const data = await this.repositoryService.watchlistItem.findMany({
        where: { userId },
        include: {
          entry: true,
        },
      });
      const watchlistEntries: WatchlistEntriesEntity = data.map((item) => {
        const transformedItem = new WatchlistEntryItemEntity(item);
        return transformedItem;
      });
      return watchlistEntries;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  async updateItem(
    id: string,
    requesterId: string,
    data: Partial<{
      rating: number;
      progress: number;
    }>,
  ) {
    this.logger.log(`Updating item with id "${id}"`);
    if (data && Object.keys(data).length === 0) {
      this.logger.error(`No data to change ${id}.`);
      throw new Error('No data to change was given.');
    }
    let item;
    try {
      item = await this.repositoryService.watchlistItem.findUnique({
        where: { id },
        include: {
          entry: true,
        },
      });
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
    if (!item) {
      this.logger.error(`Item with id "${id}" was not found.`);
      throw new Error('Item was not found.');
    }
    if (item.userId !== requesterId) {
      this.logger.error(
        `User with id "${requesterId}" tried to update item with id "${id} from the watchlist of user "${item.userId}"`,
      );
      throw new Error(
        'You are not authorized update entries from other users watchlist.',
      );
    }
    const changes: Partial<{
      rating: number;
      progress: number;
    }> = {};

    if (data?.rating) {
      if (
        data.rating <= 0 ||
        data.rating > 10 ||
        !Number.isInteger(data.rating)
      ) {
        this.logger.warn(`Rating ${data.rating} is out of range`);
        throw new Error('The given rating must be between 0 and 10');
      }
    } else {
      changes.rating = data.rating;
    }
    if (data?.progress) {
      const maxProgress = item.entry.seasonsData.reduce((acc, cur) => {
        return acc + cur;
      }, 0);
      if (
        data.progress + item.progress > maxProgress ||
        data.progress + item.progress < 0
      ) {
        this.logger.warn(`Progress ${data.progress} is out of range`);
        throw new Error('The given progress is out of range.');
      } else {
        changes.progress = data.progress + item.progress;
      }
    }
    if (Object.keys(changes).length === 0) {
      this.logger.warn(`No changes to update ${id}.`);
      const { entry, ...unchangedItem } = item;
      return new WatchlistItemEntity(unchangedItem);
    }
    try {
      const updatedItem = await this.repositoryService.watchlistItem.update({
        where: { id },
        data: {
          ...changes,
        },
      });
      return new WatchlistItemEntity(updatedItem);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }
}
