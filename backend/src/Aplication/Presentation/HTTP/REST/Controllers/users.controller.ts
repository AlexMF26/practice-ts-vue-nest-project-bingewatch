import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
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
import { UpdateUserDto } from '../DTOs/update-role.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    this.logger.log('UsersController has been initialized');
  }

  private readonly logger = new Logger(UsersController.name);

  @ApiCreatedResponse({
    // we need to use this because we are using a serializer
    type: SerializedUserEntity,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
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
      if (error.message === 'Email is already in use.') {
        throw new BadRequestException(
          `User with email "${createUserDto.email}" already exists.`,
        );
      } else {
        this.logger.error(
          `The following error occurred while registering user: ${error.message}`,
        );
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
  async update(
    @Param('id') targetId: string,
    @Body() updateUserDto: UpdateUserDto,
    @userId() requesterId: string,
  ) {
    this.logger.log(
      `An HTTP request to update user "${targetId}" from user "${requesterId}" was received.`,
    );
    if (updateUserDto && Object.keys(updateUserDto).length === 0) {
      this.logger.warn(
        `No data was provided to update "${targetId}" at the request of "${requesterId}".`,
      );
      throw new BadRequestException(
        `No data was provided to update "${targetId}".`,
      );
    }
    try {
      const user = await this.usersService.changeUserData(
        targetId,
        requesterId,
        updateUserDto,
      );
      return user;
    } catch (error) {
      if (error.message.includes('is not authorized to update user')) {
        throw new UnauthorizedException(
          `You are not allowed to update user "${targetId}".`,
        );
      } else if (error.message.includes('is not authorized to roles')) {
        throw new UnauthorizedException(`You are not authorized to roles".`);
      } else if (error.message === 'Email is already in use.') {
        throw new BadRequestException(
          `User with email "${updateUserDto.email}" already exists.`,
        );
      } else {
        this.logger.error(
          `The following error occurred while updating user: ${error.message}`,
        );
        throw error;
      }
    }
  }

  @Get(':id/watchlist')
  async getWatchlist(@Param('id') userId: string) {
    this.logger.log(
      `An HTTP request to get watchlist of user "${userId}" was received.`,
    );
    try {
      const watchlist = await this.usersService.getWatchlist(userId);
      return watchlist;
    } catch (error) {
      if (error.message.includes('was not found')) {
        this.logger.warn(`User "${userId}" was not found.`);
        throw new BadRequestException(
          `User with id "${userId}" was not found.`,
        );
      } else {
        this.logger.error(
          `The following error occurred while getting watchlist of user: ${error.message}`,
        );
        throw error;
      }
    }
  }
}
