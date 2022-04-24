import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class RepositoryService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  logger = new Logger(RepositoryService.name);
  async onModuleDestroy(): Promise<void> {
    this.logger.log('Disconnecting from database');
    await this.$disconnect();
  }

  async onModuleInit() {
    this.logger.log('Connecting to database');
    this.$use(async (params, next) => {
      this.logger.log(
        `Executing "${params.action}" action on "${params.model}" model.`,
      );
      return next(params);
    });
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
