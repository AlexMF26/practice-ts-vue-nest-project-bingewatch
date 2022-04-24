import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { SerializedUserEntity } from '../../../Domain/Entities/user.entity';
import { UserService } from '../../Logic/Services/user.service';
import { CreateUserDto } from '../DTOs/create-user.dto';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  @ApiCreatedResponse({
    // we need to use this because we are using a serializer
    type: SerializedUserEntity,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.log(
      `An HTTP request to create a new user with email ${createUserDto.email} was received`,
    );
    const user = await this.userService.findOneByEmail(createUserDto.email);
    if (user) {
      this.logger.warn(`User with email ${createUserDto.email} already exists`);
      throw new BadRequestException(
        `Email ${createUserDto.email} is already in use.`,
      );
    }
    const createdUser = await this.userService.create(createUserDto);
    this.logger.log(
      `User ${createdUser.id} with email ${createdUser.email} was created`,
    );
    return createdUser;
  }
}
