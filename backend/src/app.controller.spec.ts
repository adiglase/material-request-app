import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const appServiceMock = {
    getHealth: () => ({
      status: 'ok',
      database: 'connected',
      timestamp: '2026-03-29T00:00:00.000Z',
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should return the health payload', () => {
    expect(appController.getHealth()).toEqual({
      status: 'ok',
      database: 'connected',
      timestamp: '2026-03-29T00:00:00.000Z',
    });
  });
});
