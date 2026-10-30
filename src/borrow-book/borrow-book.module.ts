import { Module } from '@nestjs/common';
import { BorrowBookService } from './borrow-book.service.js';
import { BorrowBookController } from './borrow-book.controller.js';

@Module({
  controllers: [BorrowBookController],
  providers: [BorrowBookService],
})
export class BorrowBookModule {}
