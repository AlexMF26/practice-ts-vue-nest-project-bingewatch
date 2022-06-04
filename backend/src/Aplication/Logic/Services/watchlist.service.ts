import { Injectable, Logger } from '@nestjs/common';
import { WatchlistItemEntity } from '../../../Domain/Entities/watchlist.entity';

import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';
import { SecurityService } from './security.service';
import { EntriesService } from './entries.service';
import { UsersService } from './users.service';

@Injectable()
export class WatchlistService {
  public constructor(
    private readonly repositoryService: RepositoryService,
    private readonly usersService: UsersService,
    private readonly entriesService: EntriesService,
    private readonly securityService: SecurityService,
  ) {}

  logger = new Logger(WatchlistService.name);

  public async findItemByImdbIdForUser(imdbId: string, userId: string) {
    this.logger.log(
      `Getting item for entry "${imdbId}" in the watchlist of user "${userId}"`,
    );
    const user = await this.usersService.findById(userId);
    if (!user) {
      this.logger.warn(`User with id "${userId}" not found`);
      throw new Error('The user was not found.');
    }
    const entry = await this.entriesService.getEntryByImdbId(imdbId);
    if (!entry) {
      this.logger.warn(`Entry with imdbId "${imdbId}" not found`);
      throw new Error('Entry was not found.');
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
      return new WatchlistItemEntity(item);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async create(entryId: string, userId: string, requesterId: string) {
    this.logger.log(
      `Creating item for entry "${entryId}" in the watchlist of user "${userId}"`,
    );
    if (userId !== requesterId) {
      this.logger.error(
        `User with id "${requesterId}" tried to add entry with id "${entryId}" to the watchlist of user "${userId}"`,
      );
      throw new Error(
        'You are not authorized add entries to a watchlist that is not yours.',
      );
    }
    const existentItem = await this.findItemByImdbIdForUser(entryId, userId);
    if (existentItem) {
      this.logger.error(
        `Item for entry "${entryId}" in the watchlist of user "${userId}" already exists`,
      );
      throw new Error(
        'The given entry is already in the watchlist of the user.',
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
      return new WatchlistItemEntity(newItem);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async delete(id: string, requesterId: string) {
    this.logger.log(`Deleting item with id "${id}"`);
    // check if the id is valid
    const validId = await this.securityService.checkValidUUID(id);
    if (!validId) {
      this.logger.warn(`Invalid id "${id}".`);
      throw new Error('Id is invalid.');
    }
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
      const opinion = await this.repositoryService.opinion.findFirst({
        where: {
          authorId: item.userId,
          entryImdb: item.entryId,
        },
      });
      if (opinion) {
        this.logger.warn(
          `Item with id "${id}" was not deleted. It has an opinion associated with it.`,
        );
        throw new Error(
          'The given item was not deleted. It has an opinion associated with it.',
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

  public async updateItem(
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
    // check if the id is valid
    const validId = await this.securityService.checkValidUUID(id);
    if (!validId) {
      this.logger.warn(`Invalid id "${id}".`);
      throw new Error('Id is invalid.');
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

    if (data?.rating !== undefined && data.rating !== item?.rating) {
      const updatableRating =
        data.rating === null
          ? true
          : Number.isInteger(data.rating) &&
            data.rating >= 0 &&
            data.rating <= 10;
      if (!updatableRating) {
        this.logger.warn(`Rating ${data.rating} is out of range`);
        throw new Error('Rating is invalid. It must be between 0 and 10.');
      } else {
        changes.rating = data.rating;
      }
    }
    if (data?.progress) {
      let maxProgress: number;
      const numberofSeasons = item.entry.seasonsData.length;
      if (numberofSeasons === 0) {
        maxProgress = 1;
      } else {
        maxProgress = item.entry.seasonsData.reduce((acc, cur) => {
          return acc + cur;
        }, 0);
      }
      if (
        data.progress + item.progress > maxProgress ||
        data.progress + item.progress < 0
      ) {
        this.logger.warn(`Progress ${data.progress} is out of range`);
        throw new Error('Rating is invalid. It is out of range.');
      } else {
        changes.progress = data.progress + item.progress;
      }
    }
    if (Object.keys(changes).length === 0) {
      this.logger.warn(`No changes to update ${id}.`);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
