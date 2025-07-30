import { Test, TestingModule } from '@nestjs/testing';
import { ExcelFilesService } from './excel-files.service';

describe('ExcelFilesService', () => {
  let service: ExcelFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExcelFilesService],
    }).compile();

    service = module.get<ExcelFilesService>(ExcelFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
