import { Injectable, Logger } from '@nestjs/common';
import { Opinion } from '@prisma/client';
import { OpinionEntity } from '../../../Domain/Entities/opinion.entity';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';
import { SecurityService } from './security.service';
import { UsersService } from './users.service';
import { WatchlistService } from './watchlist.service';

@Injectable()
export class OpinionsService {
  public readonly logger = new Logger(OpinionsService.name);

  public constructor(
    private readonly repositoryService: RepositoryService,
    private readonly watchlistService: WatchlistService,
    private readonly usersService: UsersService,
    private readonly securityService: SecurityService,
  ) {}

  public async findRepliesForOpinion(opinionId: string) {
    this.logger.log(`Finding replies for opinion ${opinionId}.`);
    // will throw error if opinionId is invalid or opinion does not exist
    await this.findOpinion(opinionId);
    try {
      const opinions = await this.repositoryService.opinion.findMany({
        where: { replyTo: { id: opinionId } },
        include: {
          author: { select: { name: true } },
        },
      });
      if (!opinions) {
        return [];
      }
      return opinions.map((opinion) => new OpinionEntity(opinion));
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async findOpinion(opinionId: string) {
    this.logger.log(`Finding opinion ${opinionId}.`);
    const validOpinionId = this.securityService.checkValidUUID(opinionId);
    if (!validOpinionId) {
      this.logger.warn(`Invalid opinion id ${opinionId}.`);
      throw new Error('Id is invalid.');
    }
    try {
      const opinion = await this.repositoryService.opinion.findUnique({
        where: {
          id: opinionId,
        },
        include: {
          author: { select: { name: true } },
        },
      });
      if (!opinion) {
        this.logger.warn(`Opinion ${opinionId} does not exist.`);
        throw new Error('Opinion was not found.');
      }
      return new OpinionEntity(opinion);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async addReview(authorId: string, entryId: string, text: string) {
    this.logger.log(`Adding review for entry ${entryId} by user ${authorId}.`);
    if (text.trim().length === 0) {
      this.logger.warn('Invalid text. Cannot be empty.');
      throw new Error('Invalid text. Cannot be empty.');
    }
    const watchlistItem = await this.watchlistService.findItemByImdbIdForUser(
      entryId,
      authorId,
    );
    if (!watchlistItem) {
      this.logger.warn(
        `User ${authorId} is not watching entry ${entryId} but he tries to review it.`,
      );
      throw new Error(
        "You are not allowed to review this entry because you haven't watched it.",
      );
    }
    try {
      const preExistingReview = await this.repositoryService.opinion.findFirst({
        where: {
          authorId: authorId,
          entryImdb: entryId,
        },
      });
      if (preExistingReview) {
        this.logger.warn(
          `Review for entry ${entryId} by user ${authorId} already exists.`,
        );
        throw new Error(
          'A review for this entry by this user already exists. Cannot create a new one.',
        );
      }
      const review = await this.repositoryService.opinion.create({
        data: {
          text: text,
          author: { connect: { id: authorId } },
          entry: {
            connect: {
              imdbId: entryId,
            },
          },
        },
        include: {
          author: { select: { name: true } },
        },
      });
      return new OpinionEntity(review);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async replyToOpinion(
    opinionId: string,
    text: string,
    authorId: string,
  ) {
    this.logger.log(
      `Adding a reply for opinion ${opinionId} by user ${authorId}.`,
    );
    if (text.trim().length === 0) {
      this.logger.warn('Invalid text. Cannot be empty.');
      throw new Error('Invalid text. Cannot be empty.');
    }
    const author = await this.usersService.findById(authorId);
    if (!author) {
      this.logger.warn(`User ${authorId} does not exist.`);
      throw new Error('The user was not found.');
    }
    // will throw error if opinionId is invalid or opinion does not exist
    await this.findOpinion(opinionId);
    try {
      const reply = await this.repositoryService.opinion.create({
        data: {
          text: text,
          author: { connect: { id: authorId } },
          replyTo: { connect: { id: opinionId } },
        },
        include: {
          author: { select: { name: true } },
        },
      });
      return new OpinionEntity(reply);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async updateOpinion(
    opinionId: string,
    text: string,
    requesterId: string,
  ) {
    this.logger.log(
      `Updating opinion ${opinionId} at the request of user ${requesterId}.`,
    );
    if (text.trim().length === 0) {
      this.logger.warn('Invalid text. Cannot be empty.');
      throw new Error('Invalid text. Cannot be empty.');
    }
    // will throw error if opinionId is invalid or opinion does not exist
    const opinion = await this.findOpinion(opinionId);
    if (!opinion.text && opinion.authorId) {
      this.logger.warn(
        `The given opinion ${opinionId} is deleted and cannot be updated..`,
      );
      throw new Error('The given opinion is deleted and cannot be updated.');
    }
    if (opinion.authorId !== requesterId) {
      // will throw error if requesterId is invalid or user does not exist
      const isRequestedByAnAdmin = await this.usersService.isAdmin(requesterId);
      if (!isRequestedByAnAdmin) {
        this.logger.warn(
          `User ${requesterId} is not the authorized to update opinion ${opinionId}.`,
        );
        throw new Error('User is not authorized to update opinion.');
      }
    }
    try {
      const updatedOpinion = await this.repositoryService.opinion.update({
        where: { id: opinionId },
        data: {
          text: text,
        },
        include: {
          author: { select: { name: true } },
        },
      });
      return new OpinionEntity(updatedOpinion);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async deleteOpinion(opinionId: string, requesterId: string) {
    this.logger.log(
      `Deleting opinion ${opinionId} at the request of user ${requesterId}.`,
    );
    // will throw error if opinionId is invalid or opinion does not exist
    const opinion = await this.findOpinion(opinionId);
    if (opinion.authorId !== requesterId) {
      // will throw error if requesterId is invalid or user does not exist
      const isRequestedByAnAdmin = await this.usersService.isAdmin(requesterId);
      if (!isRequestedByAnAdmin) {
        this.logger.warn(
          `User ${requesterId} is not the authorized to delete opinion ${opinionId}.`,
        );
        throw new Error('User is not authorized to delete opinion.');
      }
    }
    try {
      return this.deleteOpinionSafely(opinionId);
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async deleteOpinionSafely(opinionId: string) {
    const shouldPreserve = await this.hasUndeletedReplies(opinionId);
    let opinion: Opinion & { author: { name: string } | null };
    if (shouldPreserve) {
      this.logger.log(
        `Opinion ${opinionId} has undeleted replies. Cannot fully delete. Will remove author and text.`,
      );
      opinion = await this.repositoryService.opinion.update({
        where: { id: opinionId },
        data: {
          author: { disconnect: true },
          text: null,
        },
        include: {
          author: { select: { name: true } },
        },
      });
    } else {
      this.logger.log(
        `Opinion ${opinionId} has no undeleted replies. Will fully delete.`,
      );
      opinion = await this.repositoryService.opinion.delete({
        where: { id: opinionId },
        include: {
          author: { select: { name: true } },
        },
      });
    }
    return new OpinionEntity(opinion);
  }

  private async hasUndeletedReplies(opinionId: string) {
    this.logger.log(`Checking if opinion ${opinionId} has undeleted replies.`);
    const replies = await this.repositoryService.opinion
      .findUnique({
        where: { id: opinionId },
      })
      .replies();
    const undeletedRepliesExist = replies.some((reply) => reply.text !== null);
    if (undeletedRepliesExist) {
      return true;
    }
    for (const reply of replies) {
      const deepUndeletedRepliesExist = await this.hasUndeletedReplies(
        reply.id,
      );
      if (deepUndeletedRepliesExist) {
        return true;
      }
    }
    return false;
  }

  public async getPreservedOpinionsIds() {
    this.logger.log('Getting preserved opinions.');
    const opinions = await this.repositoryService.opinion.findMany({
      where: {
        text: null,
        authorId: null,
      },
      select: {
        id: true,
      },
    });
    return opinions.map((opinion) => opinion.id);
  }
}
