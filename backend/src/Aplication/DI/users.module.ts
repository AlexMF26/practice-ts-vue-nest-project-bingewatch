import { Module } from '@nestjs/common';
import { UsersService as UsersService } from '../Logic/Services/users.service';
import { UsersController as UsersController } from '../Presentation/HTTP-REST/users.controller';
import { EncryptionModule } from './encryption.module';
import { RepositoryModule } from './repository.module';

@Module({
  imports: [RepositoryModule, EncryptionModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
