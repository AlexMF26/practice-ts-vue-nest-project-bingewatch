import { Module } from '@nestjs/common';
import { AppController } from '../Presentation/HTTP-REST/app.controller';
import { AppService } from '../Logic/Services/app.service';
import { RepositoryService } from '../../Infrastructure/Persistence/Repository/repository.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RepositoryService],
})
export class AppModule {}
