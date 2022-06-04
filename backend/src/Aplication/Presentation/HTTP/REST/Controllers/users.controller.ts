import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
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
import { ErrorsService } from '../../Util/errors.service';
import { CreateUserDto } from '../DTOs/create-user.dto';
import { UpdateUserDto } from '../DTOs/update-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  public constructor(
    private readonly usersService: UsersService,
    private readonly errorsService: ErrorsService,
  ) {}

  private readonly logger = new Logger(UsersController.name);

  @Get('/:id/opinions')
  public async getOpinions(@Param('id') authorId: string) {
    this.logger.log(
      `An HTTP request to get opinions of user "${authorId}" was received.`,
    );

    try {
      const opinions = await this.usersService.findOpinionsByUser(authorId);
      return opinions;
    } catch (error) {
      this.errorsService.mapToHTTPError(error);
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
      this.errorsService.mapToHTTPError(error);
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
      this.errorsService.mapToHTTPError(error);
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
      this.errorsService.mapToHTTPError(error);
    }
  }

  @ApiOkResponse({
    // we need to use this because we are using a serializer
    type: SerializedUserEntity,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  public async get(@Param('id') targetId: string) {
    this.logger.log(`An HTTP request to get user "${targetId} was received.`);
    try {
      const user = await this.usersService.getUser(targetId);
      return user;
    } catch (error) {
      this.errorsService.mapToHTTPError(error);
    }
  }
}
