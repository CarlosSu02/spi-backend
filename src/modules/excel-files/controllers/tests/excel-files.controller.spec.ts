import { Test, TestingModule } from '@nestjs/testing';
import { ExcelFilesController } from '../excel-files.controller';
import { ExcelFilesService } from '../excel-files.service';

describe('ExcelFilesController', () => {
  let controller: ExcelFilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcelFilesController],
      providers: [ExcelFilesService],
    }).compile();

    controller = module.get<ExcelFilesController>(ExcelFilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
