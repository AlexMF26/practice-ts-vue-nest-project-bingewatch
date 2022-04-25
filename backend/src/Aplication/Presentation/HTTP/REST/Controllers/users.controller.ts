import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
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
import {
  Role,
  SerializedUserEntity,
} from '../../../../../Domain/Entities/user.entity';
import { UsersService } from '../../../../Logic/Services/users.service';
import { userId } from '../../Decorators/userId.decorator';
import { JwtGuard } from '../../Guards/jwt.guard';
import { CreateUserDto } from '../DTOs/create-user.dto';
import { UpdateUserDto } from '../DTOs/update-role.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
    const user = await this.usersService.findOneByEmail(createUserDto.email);
    if (user) {
      this.logger.warn(
        `User with email "${createUserDto.email}" already exists.`,
      );
      throw new BadRequestException(
        `Email "${createUserDto.email}" is already in use.`,
      );
    }
    const createdUser = await this.usersService.create(createUserDto);
    this.logger.log(
      `User "${createdUser.id}" with email "${createdUser.email}" was created.`,
    );
    return createdUser;
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
    let user = await this.usersService.findOneById(targetId);
    if (!user) {
      this.logger.warn(`User "${targetId}" does not exist.`);
      throw new BadRequestException(`User "${targetId}" does not exist.`);
    }
    const requester = await this.usersService.findOneById(requesterId);
    if (targetId !== requesterId) {
      if (requester.role !== Role.ADMIN) {
        this.logger.warn(
          `User "${requesterId}" is not allowed to update user "${targetId}".`,
        );
        return new UnauthorizedException(
          `You are not allowed to update user "${targetId}".`,
        );
      } else {
        this.logger.log(
          `User "${requesterId}" is allowed to update user "${targetId}" because of his admin privilege.`,
        );
      }
    }
    if (!updateUserDto) {
      this.logger.warn(
        `No data was provided to update "${targetId}" at the request of "${requesterId}".`,
      );
      throw new BadRequestException(
        `No data was provided to update "${targetId}".`,
      );
    }
    if (updateUserDto.password) {
      this.logger.log(
        `Updating user "${targetId}" password at the request of "${requesterId}".`,
      );
      user = await this.updatePassword(targetId, updateUserDto.password);
    }
    if (updateUserDto.email) {
      this.logger.log(
        `Updating user "${targetId}" email at the request of "${requesterId}".`,
      );
      user = await this.updateEmail(targetId, updateUserDto.email);
    }
    if (updateUserDto.name) {
      this.logger.log(
        `Updating user "${targetId}" name at the request of "${requesterId}".`,
      );
      user = await this.updateName(targetId, updateUserDto.name);
    }

    if (updateUserDto.role) {
      this.logger.log(
        `Updating user "${targetId}" role at the request of "${requesterId}".`,
      );
      user = await this.updateRole(targetId, updateUserDto.role);
    }
    return user;
  }

  private async updateRole(id: string, role: Role) {
    const user = await this.usersService.findOneById(id);
    return user;
  }

  private async updatePassword(id: string, password: string) {
    const user = await this.usersService.findOneById(id);
    return user;
  }

  private async updateEmail(id: string, email: string) {
    const user = await this.usersService.findOneById(id);
    return user;
  }

  private async updateName(id: string, name: string) {
    const user = await this.usersService.findOneById(id);
    return user;
  }
}
