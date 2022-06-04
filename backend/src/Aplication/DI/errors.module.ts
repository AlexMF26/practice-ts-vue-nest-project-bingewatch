import { Module } from '@nestjs/common';
import { ErrorsService } from '../Presentation/HTTP/Util/errors.service';

@Module({
  providers: [ErrorsService],
  exports: [ErrorsService],
})
export class ErrorsModule {}
