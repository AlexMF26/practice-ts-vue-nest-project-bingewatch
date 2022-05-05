import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  ForbiddenException,
  Get,
  Logger,
  NotFoundException,
  Post,
  Res,
  ServiceUnavailableException,
  UnauthorizedException,
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

@Controller('authentification')
@ApiTags('authentification')
export class AuthentificationController {
  public constructor(
    private readonly encryptionService: SecurityService,
    private readonly userService: UsersService,
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
    let validUser;
    try {
      validUser = await this.userService.validateCredentials(
        loginDto.email,
        loginDto.password,
      );
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
    if (!validUser) {
      throw new ForbiddenException('Wrong name or password.');
    }
    const answear = await this.encryptionService.createJwtFromId(validUser);
    response.cookie('Authentication', answear.accessToken);
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
      const user = await this.userService.findById(id);
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
