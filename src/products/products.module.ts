import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMaterial } from '../entities/product-material.entity.js';
import { Product } from '../entities/product.entity.js';
import { RawMaterial } from '../entities/raw-material.entity.js';
import { ProductsController } from './products.controller.js';
import { ProductsService } from './products.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductMaterial, RawMaterial])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}