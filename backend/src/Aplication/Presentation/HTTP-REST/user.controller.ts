import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../../Logic/Services/user.service';
import { CreateUserDto } from '../DTOs/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {}
}
