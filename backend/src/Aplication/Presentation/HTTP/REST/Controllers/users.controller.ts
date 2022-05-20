import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  ServiceUnavailableException,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SerializedUserEntity } from '../../../../../Domain/Entities/user.entity';
import { UsersService } from '../../../../Logic/Services/users.service';
import { userId } from '../../Decorators/userId.decorator';
import { JwtGuard } from '../../Guards/jwt.guard';
import { CreateUserDto } from '../DTOs/create-user.dto';
import { UpdateUserDto } from '../DTOs/update-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  private readonly logger = new Logger(UsersController.name);

  @Get('/:id/reviews')
  public async getReviews(@Param('id') authorId: string) {
    this.logger.log(
      `An HTTP request to get entry with imdbId "${authorId}" was received.`,
    );

    try {
      const reviews = await this.usersService.findOpinionsByUser(authorId);
      return reviews;
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

  @Get(':id/watchlist')
  public async getWatchlist(@Param('id') id: string) {
    this.logger.log(
      `An HTTP request to get watchlist for user with "${id}" was received.`,
    );

    try {
      const watchlist = await this.usersService.getWatchlist(id);
      return watchlist;
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

  @ApiCreatedResponse({
    // we need to use this because we are using a serializer
    type: SerializedUserEntity,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  public async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(
      `An HTTP request to create a new user with email "${createUserDto.email}" was received.`,
    );
    try {
      const user = await this.usersService.register(createUserDto);
      this.logger.log(
        `User "${user.id}" with email "${user.email}" was created.`,
      );
      return user;
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
  @ApiOkResponse({
    // we need to use this because we are using a serializer
    type: SerializedUserEntity,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  @Patch(':id')
  public async update(
    @Param('id') targetId: string,
    @Body() updateUserDto: UpdateUserDto,
    @userId() requesterId: string,
  ) {
    this.logger.log(
      `An HTTP request to update user "${targetId}" from user "${requesterId}" was received.`,
    );
    try {
      const user = await this.usersService.changeUserData(
        targetId,
        requesterId,
        updateUserDto,
      );
      return user;
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
  @ApiOkResponse({
    // we need to use this because we are using a serializer
    type: SerializedUserEntity,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  @Get(':id')
  public async get(
    @Param('id') targetId: string,
    @userId() requesterId: string,
  ) {
    this.logger.log(
      `An HTTP request to get user "${targetId}" from user "${requesterId}" was received.`,
    );
    try {
      const user = await this.usersService.getUser(targetId, requesterId);
      return user;
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
