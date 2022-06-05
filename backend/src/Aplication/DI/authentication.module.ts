import { Module } from '@nestjs/common';
import { AuthentificationController } from '../Presentation/HTTP/REST/Controllers/authentification.controller';
import { HTTPErrorsModule } from './errors.module';
import { SecurityModule } from './security.module';
import { UsersModule } from './users.module';

@Module({
  imports: [SecurityModule, UsersModule, HTTPErrorsModule],
  controllers: [AuthentificationController],
})
export class AuthentificationModule {}
