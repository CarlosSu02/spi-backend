import { Test, TestingModule } from '@nestjs/testing';
import { PcEquipmentsController } from '../pc-equipments.controller';

describe('PcEquipmentsController', () => {
  let controller: PcEquipmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PcEquipmentsController],
    }).compile();

    controller = module.get<PcEquipmentsController>(PcEquipmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
