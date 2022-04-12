import { NestFactory } from '@nestjs/core';
import { RepositoryService } from '../Infrastructure/Persistence/Repository/repository.service';
import { AppModule } from './DI/app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(RepositoryService);
  await prismaService.enableShutdownHooks(app);
  await app.listen(3000);
}
