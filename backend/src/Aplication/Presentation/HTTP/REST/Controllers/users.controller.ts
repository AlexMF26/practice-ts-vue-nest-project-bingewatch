import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Logger,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SerializedUserEntity } from '../../../../../Domain/Entities/user.entity';
import { UsersService } from '../../../../Logic/Services/users.service';
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

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto) {
    return 'updateUser';
  }
}
