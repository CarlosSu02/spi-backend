import { Test, TestingModule } from '@nestjs/testing';
import { AirConditionersController } from '../air-conditioners.controller';

describe('AirConditionersController', () => {
  let controller: AirConditionersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AirConditionersController],
    }).compile();

    controller = module.get<AirConditionersController>(
      AirConditionersController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
