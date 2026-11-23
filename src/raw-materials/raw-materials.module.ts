import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMaterial } from '../entities/product-material.entity.js';
import { RawMaterial } from '../entities/raw-material.entity.js';
import { Supplier } from '../entities/supplier.entity.js';
import { RawMaterialsController } from './raw-materials.controller.js';
import { RawMaterialsService } from './raw-materials.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([RawMaterial, Supplier, ProductMaterial])],
  controllers: [RawMaterialsController],
  providers: [RawMaterialsService],
})
export class RawMaterialsModule {}