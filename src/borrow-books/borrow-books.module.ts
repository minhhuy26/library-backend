import { Module } from '@nestjs/common';
import { BorrowBooksService } from './borrow-books.service.js';
import { BorrowBooksController } from './borrow-books.controller.js';

@Module({
  controllers: [BorrowBooksController],
  providers: [BorrowBooksService],
})
export class BorrowBooksModule {}
