import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt';
import { BearerTokenEntity } from '../../../Domain/Entities/authentification.entity';

@Injectable()
export class SecurityService {
  public readonly logger = new Logger(SecurityService.name);

  public constructor(private readonly jwtTokenService: JwtService) {}

  public async hashString(data: string) {
    this.logger.log('Hashing string.');
    try {
      // Generate a random salt and hash the string using a cost factor of 10
      const digest = await hash(data, 10);
      // The resulting string contains the algorithm used, the cost factor, the hash and the salt delimited by a $
      return digest;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public async validateAgainstHash(data: string, digest: string) {
    this.logger.log('Validating string against hash.');
    try {
      //Hash the data using the salt and cost factor from the digest string and compare the result to the hash
      const result = await compare(data, digest);
      return result;
    } catch (error) {
      this.logger.error(error.message);
      throw error;
    }
  }

  public checkValidUUID(uuid: string) {
    this.logger.log('Checking if UUID is valid.');
    // Check if the UUID is valid using regex
    const result =
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(
        uuid,
      );
    return result;
  }

  public async createJwtFromId(id: string) {
    this.logger.log(`Creating JWT token id "${id}".`);
    const payload = { id };
    const token = this.jwtTokenService.sign(payload);
    this.logger.log(`JWT token created "${id}".`);
    const response = new BearerTokenEntity(token);
    return response;
  }
}
