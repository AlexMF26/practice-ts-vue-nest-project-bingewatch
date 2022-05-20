import { Module } from '@nestjs/common';
import { RepositoryModule } from './repository.module';
import { OpinionsService } from '../Logic/Services/opinions.service';
import { WatchlistModule } from './watchlist.module';
import { SecurityModule } from './security.module';
import { UsersModule } from './users.module';
import { OpinionsListener } from '../Logic/Listeners/opinions.listener';
import { OpinionsController } from '../Presentation/HTTP/REST/Controllers/opinions.controller';

@Module({
  imports: [RepositoryModule, WatchlistModule, UsersModule, SecurityModule],
  providers: [OpinionsService, OpinionsListener],
  exports: [OpinionsService],
  controllers: [OpinionsController],
})
export class OpinionsModule {}
