import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RepositoryService } from '../Infrastructure/Persistence/Repository/repository.service';
import { AppModule } from './DI/app.module';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';

export async function bootstrap() {
  const app = await init();
  await prepare(app);
  await start(app);
}

export async function prepare(app: INestApplication) {
  addCompression(app);
  await addPrismaHooks(app);
  addMiddleware(app);
  addSwagger(app);
  addGlobalPipes(app);
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

function addCompression(app: INestApplication) {
  app.use(compression());
  return app;
}

async function addPrismaHooks(app: INestApplication) {
  const prismaService = app.get(RepositoryService);
  await prismaService.enableShutdownHooks(app);
  return app;
}

function addSwagger(app: INestApplication) {
  const document = initalizeSwaggerDocument(app);
  SwaggerModule.setup('info', app, document);
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
    .addCookieAuth(
      'Authentication',
      {
        type: 'http',
        in: 'Header',
        scheme: 'Bearer',
      },
      'Authentication',
    )
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
function addMiddleware(app: INestApplication) {
  addCookiesMiddleware(app);
}
function addCookiesMiddleware(app: INestApplication) {
  app.use(cookieParser());
}
