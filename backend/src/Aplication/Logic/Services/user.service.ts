import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../Domain/Entities/user.entity';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';
import { EncryptionService } from './encryption.service';

@Injectable()
export class UserService {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly encryptionService: EncryptionService,
  ) {}
  async create(data: { password: string; email: string; name: string }) {
    const passwordHash = await this.encryptionService.hashString(data.password);
    const user = await this.repositoryService.user.create({
      data: {
        passwordHash,
        email: data.email,
        name: data.name,
      },
    });
    return new UserEntity(user);
  }
  async findOneByEmail(email: string) {
    const user = await this.repositoryService.user.findUnique({
      where: { email },
    });
    return new UserEntity(user);
  }
}
