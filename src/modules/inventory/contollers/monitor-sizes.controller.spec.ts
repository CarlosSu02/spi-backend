import { Test, TestingModule } from '@nestjs/testing';
import { MonitorSizesController } from './monitor-sizes.controller';

describe('MonitorSizesController', () => {
  let controller: MonitorSizesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonitorSizesController],
    }).compile();

    controller = module.get<MonitorSizesController>(MonitorSizesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
