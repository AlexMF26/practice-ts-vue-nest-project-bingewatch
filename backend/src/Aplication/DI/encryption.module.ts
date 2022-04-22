import { Module } from '@nestjs/common';
import { EncryptionService } from '../Logic/Services/encryption.service';

@Module({
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
