import { Module } from '@nestjs/common';
import { AppController } from '../Presentation/HTTP-REST/app.controller';
import { UserModule } from './user.module';

@Module({
  imports: [UserModule],
  controllers: [AppController],
})
export class AppModule {}
