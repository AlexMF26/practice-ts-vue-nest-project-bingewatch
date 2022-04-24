import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from '../Presentation/HTTP-REST/app.controller';
import { UsersModule } from './users.module';
import { config } from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: config.validationSchema,
    }),
    UsersModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
