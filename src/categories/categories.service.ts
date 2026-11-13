import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { Not, Repository } from 'typeorm';
import { Category } from './entities/category.entity.js';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async createCategories(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: {
        name: createCategoryDto.name,
      },
    });
    if (category) {
      throw new BadRequestException('Category exists');
    }
    const newCategory = await this.categoryRepository.create({
      name: createCategoryDto.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return this.categoryRepository.save(newCategory);
  }

  getListCategories() {
    return this.categoryRepository.find();
  }

  getListCategoriesId(id: string) {
    return this.categoryRepository.findOne({
      where: {
        id,
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    if (updateCategoryDto.name) {
      const existsCategory = await this.categoryRepository.findOne({
        where: {
          name: updateCategoryDto.name,
          id: Not(id),
        },
      });
      if (existsCategory) {
        throw new BadRequestException('Category exists');
      }
      category.name = updateCategoryDto.name;
    }
    category.updatedAt = new Date();
    return this.categoryRepository.save(category);
  }

  async remove(id: string) {
    const category = await this.categoryRepository.findOne({
      where: {
        id,
      },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return this.categoryRepository.remove(category);
  }
}
