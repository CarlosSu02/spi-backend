import { Test, TestingModule } from '@nestjs/testing';
import { PcEquipmentsService } from '../pc-equipments.service';

describe('PcEquipmentsService', () => {
  let service: PcEquipmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PcEquipmentsService],
    }).compile();

    service = module.get<PcEquipmentsService>(PcEquipmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
