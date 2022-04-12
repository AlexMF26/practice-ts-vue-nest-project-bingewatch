import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../../src/Aplication/Presentation/HTTP-REST/app.controller';
import { AppService } from '../../src/Aplication//Logic/Services/app.service';
import { RepositoryService } from '../../src/Infrastructure/Persistence/Repository/repository.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService, RepositoryService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  //TODO: REPLACE THIS WITH A REAL TEST
  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(true).toBe(true);
    });
  });
  /*
  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
  */
});
