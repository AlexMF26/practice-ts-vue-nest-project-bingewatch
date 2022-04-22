import { Module } from '@nestjs/common';
import { AppController } from '../Presentation/HTTP-REST/app.controller';
import { RepositoryModule } from './repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [AppController],
})
export class AppModule {}
