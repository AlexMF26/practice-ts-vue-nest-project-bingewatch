import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SerializedUserEntity } from '../../../../../Domain/Entities/user.entity';
import { UsersService } from '../../../../Logic/Services/users.service';
import { userId } from '../../Decorators/userId.decorator';
import { JwtGuard } from '../../Guards/jwt.guard';
import { LoginDto } from '../DTOs/login.dto';
import { SecurityService } from '../../../../Logic/Services/security.service';
import { ErrorsService } from '../../Util/errors.service';

@Controller('authentification')
@ApiTags('authentification')
export class AuthentificationController {
  public constructor(
    private readonly securityService: SecurityService,
    private readonly usersService: UsersService,
    private readonly errorsService: ErrorsService,
  ) {}

  private readonly logger = new Logger(AuthentificationController.name);

  @Post()
  public async loginWithCredentials(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    this.logger.log(
      `An HTTP request to login with email "${loginDto.email}" was received.`,
    );
    let validUser: string | false;
    try {
      validUser = await this.usersService.validateCredentials(
        loginDto.email,
        loginDto.password,
      );
    } catch (error) {
      this.errorsService.mapToHTTPError(error);
    }
    if (!validUser) {
      throw new ForbiddenException('Wrong name or password.');
    }
    const answear = await this.securityService.createJwtFromId(validUser);
    response.cookie('Authentication', answear);
    return answear;
  }

  @ApiCookieAuth('Authentication')
  @ApiOkResponse({
    // we need to use this because we are using a serializer
    type: SerializedUserEntity,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(JwtGuard)
  @Get('/details')
  public async getWhoAmI(@userId() id: string) {
    this.logger.log(
      `An HTTP request to get authenticated user details was received. User id: "${id}".`,
    );
    try {
      const user = await this.usersService.findById(id);
      return user;
    } catch (error) {
      this.errorsService.mapToHTTPError(error);
    }
  }
}
