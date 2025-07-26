import { Test, TestingModule } from '@nestjs/testing';
import { AudioEquipmentController } from './audio-equipment.controller';

describe('AudioEquipmentController', () => {
  let controller: AudioEquipmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AudioEquipmentController],
    }).compile();

    controller = module.get<AudioEquipmentController>(AudioEquipmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
