import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../../../Domain/Entities/user.entity';
import { EncryptionService } from './encryption.service';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthentificationService {
  constructor(
    private readonly userService: UsersService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtTokenService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthentificationService.name);

  async validateUserCredentials(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      this.logger.warn(`User with email "${email}" doesn't exist exists.`);
      return false;
    }
    const isPasswordValid = await this.encryptionService.validateAgainstHash(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      this.logger.warn('Password is not valid.');
      return false;
    }
    return user;
  }

  async loginWithCredentials(user: UserEntity) {
    const payload = { id: user.id };
    const token = this.jwtTokenService.sign(payload);

    return {
      accessToken: token,
      tokenType: 'Bearer',
    };
  }
}
