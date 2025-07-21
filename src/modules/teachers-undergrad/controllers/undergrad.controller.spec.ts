import { Test, TestingModule } from '@nestjs/testing';
import { UndergradsController } from './undergrad.controller';
import { UndergradsService } from '../services/undergrads.service';

describe('TeachersUndergradController', () => {
  let controller: UndergradsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UndergradsController],
      providers: [UndergradsService],
    }).compile();

    controller = module.get<UndergradsController>(UndergradsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
