import { Test, TestingModule } from '@nestjs/testing';
import { MonitorTypesController } from './monitor-types.controller';

describe('MonitorTypesController', () => {
  let controller: MonitorTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorTypesController],
    }).compile();

    controller = module.get<MonitorTypesController>(MonitorTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
