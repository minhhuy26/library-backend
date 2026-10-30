import { Module } from '@nestjs/common';
import { CatagoriesService } from './catagories.service.js';
import { CatagoriesController } from './catagories.controller.js';

@Module({
  controllers: [CatagoriesController],
  providers: [CatagoriesService],
})
export class CatagoriesModule {}
