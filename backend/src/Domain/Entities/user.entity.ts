import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  readonly id: string;
  readonly createdAt: Date;
  readonly Role: Role;
  readonly name: string;
  readonly email: string;
  @Exclude()
  readonly passwordHash: string;
  constructor(data: User) {
    Object.assign(this, data);
  }
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// we need to have this because we are using a serializer
export class SerializedUserEntity {
  readonly id: string;
  readonly createdAt: Date;
  readonly Role: Role;
  readonly name: string;
  readonly email: string;
}
