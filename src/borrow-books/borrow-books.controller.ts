import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BorrowBooksService } from './borrow-books.service.js';
import { CreateBorrowBookDto } from './dto/create-borrow-book.dto.js';
import { UpdateBorrowBookDto } from './dto/update-borrow-book.dto.js';

@Controller('borrow-books')
export class BorrowBooksController {
  constructor(private readonly borrowBooksService: BorrowBooksService) {}

  @Post()
  create(@Body() createBorrowBookDto: CreateBorrowBookDto) {
    return this.borrowBooksService.create(createBorrowBookDto);
  }

  @Get()
  findAll() {
    return this.borrowBooksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowBooksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBorrowBookDto: UpdateBorrowBookDto) {
    return this.borrowBooksService.update(+id, updateBorrowBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowBooksService.remove(+id);
  }
}
