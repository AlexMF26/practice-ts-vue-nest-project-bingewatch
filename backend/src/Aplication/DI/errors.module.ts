import { Module } from '@nestjs/common';
import { HTTPErrorsService } from '../Presentation/HTTP/Util/httpErrors.service';

@Module({
  providers: [HTTPErrorsService],
  exports: [HTTPErrorsService],
})
export class HTTPErrorsModule {}
