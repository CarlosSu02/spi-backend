import { Test, TestingModule } from '@nestjs/testing';
import { ShiftsController } from '../shifts.controller';
import { ShiftsService } from '.../services/shifts.service';

describe('ShiftsController', () => {
  let controller: ShiftsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShiftsController],
      providers: [ShiftsService],
    }).compile();

    controller = module.get<ShiftsController>(ShiftsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
