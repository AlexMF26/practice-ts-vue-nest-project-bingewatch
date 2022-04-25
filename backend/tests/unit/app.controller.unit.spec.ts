import { Test, TestingModule } from '@nestjs/testing';
import { RepositoryModule } from '../../src/Aplication/DI/repository.module';
import { AppController } from '../../src/Aplication/Presentation/HTTP/REST/Controllers/app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [RepositoryModule],
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
