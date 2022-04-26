import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../../../Domain/Entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthentificationService {
  constructor(private readonly jwtTokenService: JwtService) {}

  private readonly logger = new Logger(AuthentificationService.name);

  async loginWithCredentials(user: UserEntity) {
    this.logger.log(`Creating JWT token for user "${user.id}".`);
    const payload = { id: user.id };
    const token = this.jwtTokenService.sign(payload);
    this.logger.log(`JWT token created for user "${user.id}".`);
    return {
      accessToken: token,
      tokenType: 'Bearer',
    };
  }
}
