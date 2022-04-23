import { Module } from '@nestjs/common';
import { UserService } from '../Logic/Services/user.service';
import { UserController } from '../Presentation/HTTP-REST/users.controller';
import { EncryptionModule } from './encryption.module';
import { RepositoryModule } from './repository.module';

@Module({
  imports: [RepositoryModule, EncryptionModule],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
