import { Test, TestingModule } from '@nestjs/testing';
import { AudioEquipmentService } from '../audio-equipment.service';

describe('AudioEquipmentService', () => {
  let service: AudioEquipmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AudioEquipmentService],
    }).compile();

    service = module.get<AudioEquipmentService>(AudioEquipmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
