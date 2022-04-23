import { Injectable } from '@nestjs/common';
import { RepositoryService } from '../../../Infrastructure/Persistence/Repository/repository.service';
import { EncryptionService } from './encryption.service';

@Injectable()
export class UserService {
  constructor(
    private readonly repositoryService: RepositoryService,
    private readonly encryptionService: EncryptionService,
  ) {}
  async create(data: {}) {}
}
