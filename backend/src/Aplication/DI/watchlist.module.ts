import { Module } from '@nestjs/common';
import { WatchlistService } from '../Logic/Services/watchlist.service';
import { WatchlistController } from '../Presentation/HTTP/REST/Controllers/watchlist.controller';
import { SecurityModule } from './security.module';
import { EntriesModule } from './entries.module';
import { RepositoryModule } from './repository.module';
import { UsersModule } from './users.module';

@Module({
  imports: [RepositoryModule, UsersModule, EntriesModule, SecurityModule],
  providers: [WatchlistService],
  controllers: [WatchlistController],
})
export class WatchlistModule {}
