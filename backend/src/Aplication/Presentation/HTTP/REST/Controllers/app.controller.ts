import { Controller, Get, Logger } from '@nestjs/common';

@Controller()
export class AppController {
  logger = new Logger(AppController.name);

  @Get()
  public getHello() {
    this.logger.log('The HTTP-REST default route has been called.');
    return 'Hello World!';
  }
}
