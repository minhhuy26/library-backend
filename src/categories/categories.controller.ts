import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { JwtAuthGuard } from '../guards/jwt-auth-guard.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { Roles } from '../auth/decorator/roles.decorator.js';
import { Role } from '../common/enums/role.enum.js';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}
  // Create new category
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  createCategories(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategories(createCategoryDto);
  }
  // Get list categories
  @Get()
  getListCategories() {
    return this.categoriesService.getListCategories();
  }
  // Get list by ID
  @Get(':id')
  getListCategoriesId(@Param('id') id: string) {
    return this.categoriesService.getListCategoriesId(id);
  }
  // Update by ID
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
