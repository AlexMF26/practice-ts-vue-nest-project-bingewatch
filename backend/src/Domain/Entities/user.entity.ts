import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  @Exclude()
  readonly passwordHash: string;
  constructor(data: User) {
    Object.assign(this, data);
  }
}
