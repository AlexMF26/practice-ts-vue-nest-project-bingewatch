import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { OpinionsService } from '../../../../Logic/Services/opinions.service';
import { userId } from '../../Decorators/userId.decorator';
import { JwtGuard } from '../../Guards/jwt.guard';
import { ErrorsService } from '../../Util/errors.service';
import { AddReviewDto } from '../DTOs/add-review.dto';
import { OpinionContentDto } from '../DTOs/opinion-content.dto';

@Controller('opinions')
@ApiTags('opinions')
export class OpinionsController {
  private readonly logger = new Logger(OpinionsController.name);

  constructor(
    private readonly opinionsService: OpinionsService,
    private readonly errorsService: ErrorsService,
  ) {}

  @Get(':id')
  public async getOpinion(@Param('id') id: string) {
    this.logger.log(
      `An HTTP request to get opinion with "${id}" was received.`,
    );

    try {
      const opinion = await this.opinionsService.findOpinion(id);
      return opinion;
    } catch (error) {
      this.errorsService.mapToHTTPError(error);
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
      this.errorsService.mapToHTTPError(error);
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
      this.errorsService.mapToHTTPError(error);
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
      this.errorsService.mapToHTTPError(error);
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
      this.errorsService.mapToHTTPError(error);
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
      this.errorsService.mapToHTTPError(error);
    }
  }
}
