import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductMaterial } from '../entities/product-material.entity.js';
import { ProductionLog } from '../entities/production-log.entity.js';
import { Product } from '../entities/product.entity.js';
import { ProductionLogsController } from './production-logs.controller.js';
import { ProductionLogsService } from './production-logs.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([ProductionLog, Product, ProductMaterial])],
  controllers: [ProductionLogsController],
  providers: [ProductionLogsService],
})
export class ProductionLogsModule {}