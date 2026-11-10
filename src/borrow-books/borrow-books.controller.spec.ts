import { Test, TestingModule } from '@nestjs/testing';
import { BorrowBooksController } from './borrow-books.controller.js';
import { BorrowBooksService } from './borrow-books.service.js';

describe('BorrowBooksController', () => {
  let controller: BorrowBooksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BorrowBooksController],
      providers: [BorrowBooksService],
    }).compile();

    controller = module.get<BorrowBooksController>(BorrowBooksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
