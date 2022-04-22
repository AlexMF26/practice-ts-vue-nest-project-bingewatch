import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class EncryptionService {
  public async hashString(data: string) {
    //10 rounds to generate the salt
    return await hash(data, 10);
  }
  public async validateAgainstHash(data: string, hash: string) {
    return await compare(data, hash);
  }
}
