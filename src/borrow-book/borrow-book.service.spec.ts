import { Test, TestingModule } from '@nestjs/testing';
import { BorrowBookService } from './borrow-book.service.js';

describe('BorrowBookService', () => {
  let service: BorrowBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BorrowBookService],
    }).compile();

    service = module.get<BorrowBookService>(BorrowBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
