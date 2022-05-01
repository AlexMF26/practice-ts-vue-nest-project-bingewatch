import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../Presentation/HTTP/REST/Controllers/app.controller';
import { UsersModule } from './users.module';
import { config } from '../config';
import { AuthentificationModule } from './authentication.module';
import { EntriesModule } from './entries.module';
import { WatchlistModule } from './watchlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: config.validationSchema,
    }),
    UsersModule,
    AuthentificationModule,
    EntriesModule,
    WatchlistModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
