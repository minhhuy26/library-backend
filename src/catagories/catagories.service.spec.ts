import { Test, TestingModule } from '@nestjs/testing';
import { CatagoriesService } from './catagories.service.js';

describe('CatagoriesService', () => {
  let service: CatagoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CatagoriesService],
    }).compile();

    service = module.get<CatagoriesService>(CatagoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
