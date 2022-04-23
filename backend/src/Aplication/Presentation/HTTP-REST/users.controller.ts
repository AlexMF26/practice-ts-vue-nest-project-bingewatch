import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
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

  @ApiCreatedResponse({
    // we need to use this because we are using a serializer
    type: SerializedUserEntity,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.findOneByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Email is already in use.');
    }
    return await this.userService.create(createUserDto);
  }
}
