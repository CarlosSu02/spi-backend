import { Test, TestingModule } from '@nestjs/testing';
import { PcTypesController } from './pc-types.controller';

describe('PcTypesController', () => {
  let controller: PcTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PcTypesController],
    }).compile();

    controller = module.get<PcTypesController>(PcTypesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
