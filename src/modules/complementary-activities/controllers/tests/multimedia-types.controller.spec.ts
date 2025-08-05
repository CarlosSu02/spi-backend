import { Test, TestingModule } from '@nestjs/testing';
import { MultimediaTypesController } from '../multimedia-types.controller';

describe('MultimediaTypesController', () => {
  let controller: MultimediaTypesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MultimediaTypesController],
    }).compile();

    controller = module.get<MultimediaTypesController>(
      MultimediaTypesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
