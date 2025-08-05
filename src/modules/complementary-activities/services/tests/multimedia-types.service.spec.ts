import { Test, TestingModule } from '@nestjs/testing';
import { MultimediaTypesService } from '../multimedia-types.service';

describe('MultimediaTypesService', () => {
  let service: MultimediaTypesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MultimediaTypesService],
    }).compile();

    service = module.get<MultimediaTypesService>(MultimediaTypesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
