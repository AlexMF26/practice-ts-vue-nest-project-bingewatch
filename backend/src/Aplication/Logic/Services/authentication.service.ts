import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthentificationService {
  public constructor(private readonly jwtTokenService: JwtService) {}

  private readonly logger = new Logger(AuthentificationService.name);

  public async loginWithCredentials(id: string) {
    this.logger.log(`Creating JWT token for user "${id}".`);
    const payload = { id };
    const token = this.jwtTokenService.sign(payload);
    this.logger.log(`JWT token created for user "${id}".`);
    return {
      accessToken: token,
      tokenType: 'Bearer',
    };
  }
}
