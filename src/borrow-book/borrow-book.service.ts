import { Injectable } from '@nestjs/common';
import { CreateBorrowBookDto } from './dto/create-borrow-book.dto.js';
import { UpdateBorrowBookDto } from './dto/update-borrow-book.dto.js';

@Injectable()
export class BorrowBookService {
  create(createBorrowBookDto: CreateBorrowBookDto) {
    return 'This action adds a new borrowBook';
  }

  findAll() {
    return `This action returns all borrowBook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} borrowBook`;
  }

  update(id: number, updateBorrowBookDto: UpdateBorrowBookDto) {
    return `This action updates a #${id} borrowBook`;
  }

  remove(id: number) {
    return `This action removes a #${id} borrowBook`;
  }
}
