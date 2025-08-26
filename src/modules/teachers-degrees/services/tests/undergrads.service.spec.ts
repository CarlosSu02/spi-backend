import { Test, TestingModule } from '@nestjs/testing';
import { UndergradsService } from '../undergrads.service';

describe('TeachersUndergradService', () => {
  let service: UndergradsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UndergradsService],
    }).compile();

    service = module.get<UndergradsService>(UndergradsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
