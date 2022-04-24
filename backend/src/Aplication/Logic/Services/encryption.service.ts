import { Injectable, Logger } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class EncryptionService {
  logger = new Logger(EncryptionService.name);
  /**
   * @param  {string} data The string to be hashed.
   * @returns {Promise<string>} A promise to be resolved with the hashed string, the salt, the algorithm used and the cost factor.
   */
  public async hashString(data: string): Promise<string> {
    this.logger.log('Hashing string.');
    //Use 2^10 rounds
    return await hash(data, 10);
  }
  /**
   * @param  {string} data The string to be checked.
   * @param  {string} hash The bcrypt return string to compare with.
   * @returns {Promise<boolean>} A promise to be resolved with true if the string is a match, false otherwise.
   */
  public async validateAgainstHash(
    data: string,
    hash: string,
  ): Promise<boolean> {
    this.logger.log('Validating string against hash.');
    /*
      Take the salt from the hash(bcrypt stores the salt in the hash)
      hash the data and compare it to the hash
    */
    return await compare(data, hash);
  }
}
