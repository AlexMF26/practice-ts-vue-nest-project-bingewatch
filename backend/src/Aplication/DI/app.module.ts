import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../Presentation/HTTP-REST/app.controller';
import { UserModule } from './user.module';
import { config } from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: config.validationSchema,
    }),
    UserModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
