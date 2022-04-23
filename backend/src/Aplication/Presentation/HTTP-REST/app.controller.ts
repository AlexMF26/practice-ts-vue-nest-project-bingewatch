import { Controller, Get, Logger } from '@nestjs/common';

@Controller()
export class AppController {
  logger = new Logger(AppController.name);
  @Get()
  getHello() {
    this.logger.log('default route has been called');
    return 'Hello World!';
  }
}
