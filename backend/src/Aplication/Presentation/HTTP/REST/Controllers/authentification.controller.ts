import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SerializedUserEntity } from '../../../../../Domain/Entities/user.entity';
import { AuthentificationService } from '../../../../Logic/Services/authentication.service';
import { UsersService } from '../../../../Logic/Services/users.service';
import { userId } from '../../Decorators/userId.decorator';
import { JwtGuard } from '../../Guards/jwt.guard';
import { LoginDto } from '../DTOs/login.dto';

@Controller('authentification')
@ApiTags('authentification')
export class AuthentificationController {
  constructor(
    private readonly authenticationService: AuthentificationService,
    private readonly userService: UsersService,
  ) {}
  private readonly logger = new Logger(AuthentificationService.name);

  @Post()
  async loginWithCredentials(@Body() loginDto: LoginDto) {
    this.logger.log(
      `An HTTP request to login with email "${loginDto.email}" was received.`,
    );
    const validUser = await this.authenticationService.validateUserCredentials(
      loginDto.email,
      loginDto.password,
    );
    if (!validUser) {
      this.logger.warn('Credentials are not valid.');
      throw new ForbiddenException('Wrong name or password.');
    }
    return this.authenticationService.loginWithCredentials(validUser);
  }

  @ApiCookieAuth('Authentication')
  @ApiOkResponse({
    // we need to use this because we are using a serializer
    type: SerializedUserEntity,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  @Get('/details')
  async getWhoAmI(@userId() id: string) {
    this.logger.log(
      `An HTTP request to get authenticated user details was received. User id: "${id}".`,
    );
    const user = await this.userService.findOneById(id);
    return user;
  }
}
