import { Injectable } from '@nestjs/common';
import { CreateCatagoryDto } from './dto/create-catagory.dto.js';
import { UpdateCatagoryDto } from './dto/update-catagory.dto.js';

@Injectable()
export class CatagoriesService {
  create(createCatagoryDto: CreateCatagoryDto) {
    return 'This action adds a new catagory';
  }

  findAll() {
    return `This action returns all catagories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} catagory`;
  }

  update(id: number, updateCatagoryDto: UpdateCatagoryDto) {
    return `This action updates a #${id} catagory`;
  }

  remove(id: number) {
    return `This action removes a #${id} catagory`;
  }
}
