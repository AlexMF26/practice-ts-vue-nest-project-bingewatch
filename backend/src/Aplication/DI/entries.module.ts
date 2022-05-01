import { Module } from '@nestjs/common';
import { EntriesService } from '../Logic/Services/entries.service';
import { EntriesController } from '../Presentation/HTTP/REST/Controllers/entries.controller';
import { OmdbModule } from './omdb.module';
import { RepositoryModule } from './repository.module';

@Module({
  imports: [RepositoryModule, OmdbModule],
  providers: [EntriesService],
  controllers: [EntriesController],
  exports: [EntriesService],
})
export class EntriesModule {}
