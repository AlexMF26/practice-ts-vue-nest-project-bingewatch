import { Injectable, Logger } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class EncryptionService {
  public readonly logger = new Logger(EncryptionService.name);

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
}
