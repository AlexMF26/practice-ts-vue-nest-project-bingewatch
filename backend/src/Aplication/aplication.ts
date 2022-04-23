import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RepositoryService } from '../Infrastructure/Persistence/Repository/repository.service';
import { AppModule } from './DI/app.module';

export async function bootstrap() {
  const app = await init();
  await addPrismaHooks(app);
  addSwagger(app);
  addGlobalPipes(app);
  await start(app);
}

async function init() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  return app;
}

async function start(app: INestApplication) {
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  await app.listen(port);
}

async function addPrismaHooks(app: INestApplication) {
  const prismaService = app.get(RepositoryService);
  await prismaService.enableShutdownHooks(app);
  return app;
}

function addSwagger(app: INestApplication) {
  const document = initalizeSwaggerDocument(app);
  SwaggerModule.setup('api', app, document);
  return app;
}

function initalizeSwaggerDocument(app: INestApplication) {
  const config = getSwaggerConfig();
  const document = SwaggerModule.createDocument(app, config);
  return document;
}

function getSwaggerConfig() {
  const config = new DocumentBuilder()
    .setTitle('Bingewatch API')
    .setDescription('Bingewatch API description')
    .setVersion('1.0')
    .build();
  return config;
}

function addGlobalPipes(app: INestApplication) {
  addValidationPipe(app);
  return app;
}

function addValidationPipe(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  return app;
}
