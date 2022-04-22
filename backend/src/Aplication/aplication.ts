import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RepositoryService } from '../Infrastructure/Persistence/Repository/repository.service';
import { AppModule } from './DI/app.module';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  addPrismaHooks(app);
  await app.listen(3000);
}

async function addPrismaHooks(app: INestApplication) {
  const prismaService = app.get(RepositoryService);
  await prismaService.enableShutdownHooks(app);
  addSwagger(app);
  return app;
}

function addSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Bingewatch API')
    .setDescription('Bingewatch API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  return app;
}
