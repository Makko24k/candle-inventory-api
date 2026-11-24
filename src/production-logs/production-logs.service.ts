import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ProductMaterial } from '../entities/product-material.entity.js';
import { ProductionLog } from '../entities/production-log.entity.js';
import { Product } from '../entities/product.entity.js';
import { RawMaterial } from '../entities/raw-material.entity.js';
import { CreateProductionLogDto } from './dto/create-production-log.dto.js';
import { ListProductionLogsQueryDto } from './dto/list-production-logs-query.dto.js';

@Injectable()
export class ProductionLogsService {
  constructor(
    @InjectRepository(ProductionLog)
    private logRepo: Repository<ProductionLog>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductMaterial)
    private recipeRepo: Repository<ProductMaterial>,
    private dataSource: DataSource, // used for the all-or-nothing transaction
  ) {}

  // GET /production-logs  and  GET /production-logs?productId=1
  findAll(query: ListProductionLogsQueryDto) {
    const where: { productId?: number } = {};
    if (query.productId) {
      where.productId = Number(query.productId);
    }
    return this.logRepo.find({ where, order: { productionId: 'ASC' } });
  }

  // POST /production-logs
  async create(dto: CreateProductionLogDto, userId: number) {
    // 1. The product must exist
    const product = await this.productRepo.findOne({
      where: { productId: dto.productId },
    });
    if (!product) {
      throw new NotFoundException({
        message: 'Product not found.',
        errors: [`No product exists with ID ${dto.productId}.`],
      });
    }

    // 2. Get the recipe, together with each raw material
    const recipe = await this.recipeRepo.find({
      where: { productId: dto.productId },
      relations: { material: true },
    });
    if (recipe.length === 0) {
      throw new BadRequestException({
        message: 'This product has no recipe yet.',
        errors: ['Add raw materials to the recipe first.'],
      });
    }

    // 3. Check there is enough of EVERY material before changing anything
    const shortages: string[] = [];
    for (const line of recipe) {
      const needed = Number((line.quantityNeeded * dto.quantityProduced).toFixed(2));
      if (line.material.quantityInStock < needed) {
        const missing = (needed - line.material.quantityInStock).toFixed(2);
        shortages.push(
          `${line.material.materialName} is short by ${missing} ${line.material.unit}.`,
        );
      }
    }
    if (shortages.length > 0) {
      throw new ConflictException({
        message: 'Not enough raw materials.',
        errors: shortages,
      });
    }

    // 4. Do all the changes in ONE transaction (all succeed, or none do)
    return this.dataSource.transaction(async (manager) => {
      // Deduct each raw material used by the recipe
      for (const line of recipe) {
        const needed = Number((line.quantityNeeded * dto.quantityProduced).toFixed(2));
        await manager.decrement(
          RawMaterial,
          { materialId: line.materialId },
          'quantityInStock',
          needed,
        );
      }

      // Add the new candles to the finished product stock
      await manager.increment(
        Product,
        { productId: dto.productId },
        'quantityInStock',
        dto.quantityProduced,
      );

      // Save the production log record
      const log = manager.create(ProductionLog, {
        productId: dto.productId,
        userId,
        quantityProduced: dto.quantityProduced,
        dateProduced: dto.dateProduced,
      });
      return manager.save(log);
    });
  }
}