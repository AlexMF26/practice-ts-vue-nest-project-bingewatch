import { Injectable, Logger } from '@nestjs/common';
import { UserEntity } from '../../../Domain/Entities/user.entity';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';
import { EncryptionService } from './encryption.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly encryptionService: EncryptionService,
  ) {}

  logger = new Logger(UsersService.name);

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
    this.logger.warn(`User with email "${email}" was not found.`);
    return null;
  }

  async findOneById(id: string) {
    this.logger.log(`Finding user with id "${id}".`);
    const user = await this.repositoryService.user.findUnique({
      where: { id },
    });
    if (user) {
      this.logger.log(`User "${user.id}" was found.`);
      return new UserEntity(user);
    }
    this.logger.warn(`User with id "${id}" was not found.`);
    return null;
  }

  async getRole(id: string) {
    this.logger.log(`Getting role for user with id "${id}".`);
    const user = await this.repositoryService.user.findUnique({
      where: { id },
      select: {
        role: true,
      },
    });
    if (user) {
      this.logger.log(`User "${id}" was found.`);
      return user.role;
    }
    this.logger.warn(`User with id "${id}" was not found.`);
    return null;
  }
}
