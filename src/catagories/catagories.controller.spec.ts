import { Test, TestingModule } from '@nestjs/testing';
import { CatagoriesController } from './catagories.controller.js';
import { CatagoriesService } from './catagories.service.js';

describe('CatagoriesController', () => {
  let controller: CatagoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatagoriesController],
      providers: [CatagoriesService],
    }).compile();

    controller = module.get<CatagoriesController>(CatagoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
