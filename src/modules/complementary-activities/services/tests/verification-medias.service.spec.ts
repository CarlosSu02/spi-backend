import { Test, TestingModule } from '@nestjs/testing';
import { VerificationMediasService } from '../verification-medias.service';

describe('VerificationMediasService', () => {
  let service: VerificationMediasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerificationMediasService],
    }).compile();

    service = module.get<VerificationMediasService>(VerificationMediasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
