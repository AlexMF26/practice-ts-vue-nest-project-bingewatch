import { Injectable, Logger } from '@nestjs/common';
import { EntryEntity } from '../../../Domain/Entities/entry.entity';
import { Role, UserEntity } from '../../../Domain/Entities/user.entity';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';
import { EncryptionService } from './encryption.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly encryptionService: EncryptionService,
  ) {
    this.logger.log('UsersService has been initialized');
  }

  logger = new Logger(UsersService.name);

  async register(data: { password: string; email: string; name: string }) {
    this.logger.log(`Registering user with email "${data.email}".`);
    const existentUser = await this.findOneByEmail(data.email);
    if (existentUser) {
      this.logger.warn(`User with email "${data.email}" already exists.`);
      throw new Error('Email is already in use.');
    }
    const passwordHash = await this.encryptionService.hashString(data.password);
    const userData = {
      passwordHash,
      email: data.email,
      name: data.name,
    };
    const user = await this.create(userData);
    return user;
  }

  private async create(data: {
    passwordHash: string;
    email: string;
    name: string;
  }) {
    this.logger.log(`Creating user with email "${data.email}".`);
    const user = await this.repositoryService.user.create({
      data,
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
      select: { id: true },
    });
    if (user) {
      this.logger.log(`User "${user.id}" with email "${email}" was found.`);
      return user.id;
    }
    this.logger.log(`User with email "${email}" was not found.`);
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
    this.logger.log(`User with id "${id}" was not found.`);
    return null;
  }

  private async update(id: string, data: Partial<UserEntity>) {
    this.logger.log(`Updating user with id "${id}".`);
    const user = await this.repositoryService.user.update({
      where: { id },
      data,
    });
    return new UserEntity(user);
  }

  async changeUserData(
    id: string,
    requesterId: string,
    data: Partial<{
      password: string;
      email: string;
      name: string;
      role: Role;
    }>,
  ) {
    const isAdmin = await this.isAdmin(requesterId);
    const isAuthorized = id === requesterId || isAdmin;
    if (!isAuthorized) {
      this.logger.warn(
        `User "${requesterId}" is not authorized to update user "${id}".`,
      );
      throw new Error(
        `User "${requesterId}" is not authorized to update user "${id}".`,
      );
    }
    const updateData: Partial<{
      passwordHash: string;
      email: string;
      name: string;
      role: Role;
    }> = {};
    let user = await this.findOneById(id);
    if (data?.role && user.role !== data?.role) {
      if (!isAdmin) {
        this.logger.warn(`User "${requesterId}" is not authorized to roles".`);
        throw new Error(`User "${requesterId}" is not authorized to roles".`);
      } else {
        this.logger.log(`User ${id} role will be changed to ${data.role}`);
        updateData.role = data?.role;
      }
    }
    if (data?.password) {
      const isTheSamePassword =
        await this.encryptionService.validateAgainstHash(
          data?.password,
          user.passwordHash,
        );
      if (!isTheSamePassword) {
        const passwordHash = await this.encryptionService.hashString(
          data?.password,
        );
        this.logger.log(`User "${id}" password will be changed.`);
        updateData.passwordHash = passwordHash;
      }
    }
    if (data?.email && user.email !== data?.email) {
      const existentUser = await this.findOneByEmail(data?.email);
      if (existentUser) {
        this.logger.warn(`User with email "${data?.email}" already exists.`);
        throw new Error('Email is already in use.');
      }
      this.logger.log(`User "${id}" email will be changed.`);
      updateData.email = data?.email;
    }
    if (data?.name && user.name !== data?.name) {
      this.logger.log(`User "${id}" name will be changed.`);
      updateData.name = data?.name;
    }
    if (Object.keys(updateData).length === 0) {
      this.logger.log(`User "${id}" data was not changed.`);
    } else {
      user = await this.update(id, updateData);
    }
    return user;
  }

  async validateCredentials(email: string, password: string) {
    this.logger.log(`Validating credentials for user with email "${email}".`);
    const user = await this.repositoryService.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });
    if (!user) {
      this.logger.warn(`User with email "${email}" doesn't exist exists.`);
      return false;
    }
    const isPasswordValid = await this.encryptionService.validateAgainstHash(
      password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      this.logger.warn('Password is not valid.');
      return false;
    }
    return user.id;
  }

  private async isAdmin(id: string) {
    this.logger.log(`Checking if user with id "${id}" is admin.`);
    const { role } = await this.repositoryService.user.findUnique({
      where: { id },
      select: { role: true },
    });
    if (role === Role.ADMIN) {
      this.logger.log(`User "${id}" is admin.`);
      return true;
    }
    this.logger.log(`User "${id}" is not admin.`);
    return false;
  }

  async getWatchlist(userId: string) {
    this.logger.log(`Getting watchlist for user with id "${userId}".`);
    const user = await this.findOneById(userId);
    if (!user) {
      this.logger.warn(`User with id "${userId}" was not found.`);
      throw new Error(`User with id "${userId}" was not found.`);
    }
    const data = await this.repositoryService.watchlistItem.findMany({
      where: { userId },
      include: {
        entry: true,
      },
    });
    const watchlist = data.map((item) => {
      const entry = new EntryEntity(item.entry);
      const { id, progress, rating } = item;
      return { entry, id, progress, rating };
    });
    return watchlist;
  }
}
