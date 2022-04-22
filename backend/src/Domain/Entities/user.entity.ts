export class UserEntity {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly passwordHash: string;
  constructor(data: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
  }) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
  }
}
