import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../../../Domain/Entities/user.entity';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';
import { EncryptionService } from './encryption.service';

@Injectable()
export class UserService {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly encryptionService: EncryptionService,
  ) {}
  logger = new Logger(UserService.name);
  async create(data: { password: string; email: string; name: string }) {
    this.logger.log(`Creating user with email "${data.email}".`);
    const passwordHash = await this.encryptionService.hashString(data.password);
    const user = await this.repositoryService.user.create({
      data: {
        passwordHash,
        email: data.email,
        name: data.name,
      },
    });
    this.logger.log(
      `User "${user.id}" with email "${user.email}" was created.`,
    );
    return new UserEntity(user);
  }
  async findOneByEmail(email: string) {
    this.logger.log(`Finding user with email "${email}".`);
    const user = await this.repositoryService.user.findUnique({
      where: { email },
    });
    if (user) {
      this.logger.log(
        `User "${user.id}" with email "${user.email}" was found.`,
      );
      return new UserEntity(user);
    }
    this.logger.log(`User with email "${email}" was not found.`);
    return null;
  }
}
