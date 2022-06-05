import { Module } from '@nestjs/common';
import { UsersService as UsersService } from '../Logic/Services/users.service';
import { UsersController } from '../Presentation/HTTP/REST/Controllers/users.controller';
import { SecurityModule } from './security.module';
import { RepositoryModule } from './repository.module';
import { HTTPErrorsModule } from './errors.module';

@Module({
  imports: [RepositoryModule, SecurityModule, HTTPErrorsModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
