import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  public readonly id: string;
  public readonly role: Role;
  public readonly name: string;
  public readonly email: string;
  @Exclude()
  public readonly passwordHash: string;
  public constructor(data: User) {
    Object.assign(this, data);
  }
}

export enum Role {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// we need to have this because we are using a serializer
export class SerializedUserEntity {
  public readonly id: string;
  public readonly role: Role;
  public readonly name: string;
  public readonly email: string;
}
