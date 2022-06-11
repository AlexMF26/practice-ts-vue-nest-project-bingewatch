import { Global, Module } from '@nestjs/common';
import { HTTPErrorsService } from '../Presentation/HTTP/Util/httpErrors.service';

@Global()
@Module({
  providers: [HTTPErrorsService],
  exports: [HTTPErrorsService],
})
export class HTTPErrorsModule {}
