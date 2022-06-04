import { Module } from '@nestjs/common';
import { EntriesListener } from '../Logic/Listeners/entries.listener';
import { EntriesService } from '../Logic/Services/entries.service';
import { EntriesController } from '../Presentation/HTTP/REST/Controllers/entries.controller';
import { ErrorsModule } from './errors.module';
import { OmdbModule } from './omdb.module';
import { RepositoryModule } from './repository.module';

@Module({
  imports: [RepositoryModule, OmdbModule, ErrorsModule],
  providers: [EntriesService, EntriesListener],
  controllers: [EntriesController],
  exports: [EntriesService],
})
export class EntriesModule {}
