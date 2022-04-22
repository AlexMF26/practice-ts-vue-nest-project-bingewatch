import { Module } from '@nestjs/common';
import { RepositoryService } from '../../Infrastructure/Persistence/Repository/repository.service';

@Module({
  providers: [RepositoryService],
  exports: [RepositoryService],
})
export class RepositoryModule {}
