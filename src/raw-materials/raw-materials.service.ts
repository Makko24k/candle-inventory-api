import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductMaterial } from '../entities/product-material.entity.js';
import { RawMaterial } from '../entities/raw-material.entity.js';
import { Supplier } from '../entities/supplier.entity.js';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto.js';
import { ListRawMaterialsQueryDto } from './dto/list-raw-materials-query.dto.js';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto.js';

@Injectable()
export class RawMaterialsService {
  constructor(
    @InjectRepository(RawMaterial)
    private rawMaterialRepo: Repository<RawMaterial>,
    @InjectRepository(Supplier)
    private supplierRepo: Repository<Supplier>,
    @InjectRepository(ProductMaterial)
    private productMaterialRepo: Repository<ProductMaterial>,
  ) {}

  // GET /raw-materials  and  GET /raw-materials?lowStock=true
  findAll(query: ListRawMaterialsQueryDto) {
    const builder = this.rawMaterialRepo.createQueryBuilder('material');

    if (query.lowStock === 'true') {
      // low stock = quantity is at or below the reorder level
      builder.where('material.quantityInStock <= material.reorderLevel');
    } else if (query.lowStock === 'false') {
      builder.where('material.quantityInStock > material.reorderLevel');
    }

    return builder.orderBy('material.materialId', 'ASC').getMany();
  }

  // GET /raw-materials/{id}
  async findOne(id: number) {
    const material = await this.rawMaterialRepo.findOne({
      where: { materialId: id },
    });
    if (!material) {
      throw new NotFoundException({
        message: 'Raw material not found.',
        errors: [`No raw material exists with ID ${id}.`],
      });
    }
    return material;
  }

  // POST /raw-materials
  async create(dto: CreateRawMaterialDto) {
    await this.checkSupplierExists(dto.supplierId);
    const material = this.rawMaterialRepo.create(dto);
    return this.rawMaterialRepo.save(material);
  }

  // PATCH /raw-materials/{id}
  async update(id: number, dto: UpdateRawMaterialDto) {
    const material = await this.findOne(id); // 404 if it does not exist
    if (dto.supplierId !== undefined) {
      await this.checkSupplierExists(dto.supplierId);
    }
    Object.assign(material, dto); // only the fields that were sent
    return this.rawMaterialRepo.save(material);
  }

  // DELETE /raw-materials/{id}
  async remove(id: number) {
    await this.findOne(id); // 404 if it does not exist

    // A material that is part of a recipe cannot be deleted
    const timesUsed = await this.productMaterialRepo.count({
      where: { materialId: id },
    });
    if (timesUsed > 0) {
      throw new ConflictException({
        message: 'Raw material is still used in a product recipe.',
        errors: [`Material ${id} is used by an existing product recipe.`],
      });
    }

    await this.rawMaterialRepo.delete(id);
  }

  // Makes sure the supplier we point to really exists (foreign key check)
  private async checkSupplierExists(supplierId: number) {
    const supplier = await this.supplierRepo.findOne({
      where: { supplierId },
    });
    if (!supplier) {
      throw new BadRequestException({
        message: 'Supplier not found.',
        errors: [`No supplier exists with ID ${supplierId}.`],
      });
    }
  }
}