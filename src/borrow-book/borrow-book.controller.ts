import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BorrowBookService } from './borrow-book.service.js';
import { CreateBorrowBookDto } from './dto/create-borrow-book.dto.js';
import { UpdateBorrowBookDto } from './dto/update-borrow-book.dto.js';

@Controller('borrow-book')
export class BorrowBookController {
  constructor(private readonly borrowBookService: BorrowBookService) {}

  @Post()
  create(@Body() createBorrowBookDto: CreateBorrowBookDto) {
    return this.borrowBookService.create(createBorrowBookDto);
  }

  @Get()
  findAll() {
    return this.borrowBookService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.borrowBookService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBorrowBookDto: UpdateBorrowBookDto) {
    return this.borrowBookService.update(+id, updateBorrowBookDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.borrowBookService.remove(+id);
  }
}
