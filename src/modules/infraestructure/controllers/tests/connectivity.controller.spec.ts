import { Test, TestingModule } from '@nestjs/testing';
import { ConnectivityController } from '../connectivity.controller';

describe('ConnectivityController', () => {
  let controller: ConnectivityController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectivityController],
    }).compile();

    controller = module.get<ConnectivityController>(ConnectivityController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
