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
  ServiceUnavailableException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { OpinionsService } from '../../../../Logic/Services/opinions.service';
import { userId } from '../../Decorators/userId.decorator';
import { JwtGuard } from '../../Guards/jwt.guard';
import { AddReviewDto } from '../DTOs/add-review.dto';
import { OpinionContentDto } from '../DTOs/opinion-content.dto';

@Controller('Opinions')
@ApiTags('opinions')
export class OpinionsController {
  private readonly logger = new Logger(OpinionsController.name);

  constructor(private readonly opinionsService: OpinionsService) {}

  @Get(':id')
  public async getOpinion(@Param('id') id: string) {
    this.logger.log(
      `An HTTP request to get opinion with "${id}" was received.`,
    );

    try {
      const opinion = await this.opinionsService.findOpinion(id);
      return opinion;
    } catch (error) {
      if (error.message.includes('found')) {
        throw new NotFoundException(error.message);
      } else if (
        error.message.includes('given') ||
        error.message.includes('invalid')
      ) {
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

  @Get(':id/replies')
  public async getReplies(@Param('id') id: string) {
    this.logger.log(
      `An HTTP request to get replies for opinion with "${id}" was received.`,
    );

    try {
      const replies = await this.opinionsService.findRepliesForOpinion(id);
      return replies;
    } catch (error) {
      if (error.message.includes('found')) {
        throw new NotFoundException(error.message);
      } else if (
        error.message.includes('given') ||
        error.message.includes('invalid')
      ) {
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
  @Post()
  public async addReview(
    @userId() authorId: string,
    @Body() createItemDto: AddReviewDto,
  ) {
    this.logger.log(
      `An HTTP request to add a review with from user ${authorId} was received.`,
    );

    try {
      const review = await this.opinionsService.addReview(
        authorId,
        createItemDto.entryId,
        createItemDto.text,
      );
      return review;
    } catch (error) {
      if (error.message.includes('found')) {
        throw new NotFoundException(error.message);
      } else if (
        error.message.includes('given') ||
        error.message.includes('invalid')
      ) {
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
  @Post(':id/replies')
  public async addReply(
    @Param('id') opinionId: string,
    @userId() authorId: string,
    @Body() opinionDto: OpinionContentDto,
  ) {
    this.logger.log(
      `An HTTP request to add a reply to opinion ${opinionId} from user ${authorId} was received.`,
    );

    try {
      const reply = await this.opinionsService.replyToOpinion(
        opinionId,
        opinionDto.text,
        authorId,
      );
      return reply;
    } catch (error) {
      if (error.message.includes('found')) {
        throw new NotFoundException(error.message);
      } else if (
        error.message.includes('given') ||
        error.message.includes('invalid')
      ) {
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
  @Patch(':id')
  public async updateOpinon(
    @Param('id') opinionId: string,
    @userId() requesterId: string,
    @Body() opinionDto: OpinionContentDto,
  ) {
    this.logger.log(
      `An HTTP request to update opinion ${opinionId} from user ${requesterId} was received.`,
    );

    try {
      const opinion = await this.opinionsService.updateOpinion(
        opinionId,
        opinionDto.text,
        requesterId,
      );
      return opinion;
    } catch (error) {
      if (error.message.includes('found')) {
        throw new NotFoundException(error.message);
      } else if (
        error.message.includes('given') ||
        error.message.includes('invalid')
      ) {
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
  @Delete(':id')
  public async deleteOpinon(
    @Param('id') opinionId: string,
    @userId() requesterId: string,
  ) {
    this.logger.log(
      `An HTTP request to delete opinion ${opinionId} from user ${requesterId} was received.`,
    );
    try {
      const opinion = await this.opinionsService.deleteOpinion(
        opinionId,
        requesterId,
      );
      return opinion;
    } catch (error) {
      if (error.message.includes('found')) {
        throw new NotFoundException(error.message);
      } else if (
        error.message.includes('given') ||
        error.message.includes('invalid')
      ) {
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
