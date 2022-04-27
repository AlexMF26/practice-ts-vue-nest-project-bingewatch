import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OmdbService } from '../../Infrastructure/Adapters/Omdb/omdb.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get<string>('OMDB_API'),
        params: { apiKey: configService.get<string>('OMDB_apikey') },
      }),
    }),
  ],
  providers: [OmdbService],
  exports: [OmdbService],
})
export class OmdbModule {}
