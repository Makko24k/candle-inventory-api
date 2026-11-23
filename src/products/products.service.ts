import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductMaterial } from '../entities/product-material.entity.js';
import { Product } from '../entities/product.entity.js';
import { RawMaterial } from '../entities/raw-material.entity.js';
import { AddRecipeMaterialDto } from './dto/add-recipe-material.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(ProductMaterial)
    private recipeRepo: Repository<ProductMaterial>,
    @InjectRepository(RawMaterial)
    private materialRepo: Repository<RawMaterial>,
  ) {}

  // GET /products
  findAll() {
    return this.productRepo.find({ order: { productId: 'ASC' } });
  }

  // GET /products/{id}
  async findOne(id: number) {
    const product = await this.productRepo.findOne({
      where: { productId: id },
    });
    if (!product) {
      throw new NotFoundException({
        message: 'Product not found.',
        errors: [`No product exists with ID ${id}.`],
      });
    }
    return product;
  }

  // POST /products
  create(dto: CreateProductDto) {
    const product = this.productRepo.create({
      productName: dto.productName,
      scent: dto.scent ?? null,
      price: dto.price,
      quantityInStock: dto.quantityInStock ?? 0,
    });
    return this.productRepo.save(product);
  }

  // PATCH /products/{id}
  async update(id: number, dto: UpdateProductDto) {
    const product = await this.findOne(id); // 404 if it does not exist
    Object.assign(product, dto); // only the fields that were sent
    return this.productRepo.save(product);
  }

  // GET /products/{id}/materials  (the recipe)
  async getRecipe(productId: number) {
    await this.findOne(productId); // 404 if the product does not exist
    return this.recipeRepo.find({
      where: { productId },
      order: { productMaterialId: 'ASC' },
    });
  }

  // POST /products/{id}/materials  (add one material to the recipe)
  async addToRecipe(productId: number, dto: AddRecipeMaterialDto) {
    await this.findOne(productId); // 404 if the product does not exist

    const material = await this.materialRepo.findOne({
      where: { materialId: dto.materialId },
    });
    if (!material) {
      throw new BadRequestException({
        message: 'Raw material not found.',
        errors: [`No raw material exists with ID ${dto.materialId}.`],
      });
    }

    // The same material cannot be added twice to one recipe
    const existing = await this.recipeRepo.findOne({
      where: { productId, materialId: dto.materialId },
    });
    if (existing) {
      throw new ConflictException({
        message: 'Material is already in this recipe.',
        errors: [
          `Material ${dto.materialId} already exists in the recipe of product ${productId}.`,
        ],
      });
    }

    const line = this.recipeRepo.create({
      productId,
      materialId: dto.materialId,
      quantityNeeded: dto.quantityNeeded,
    });
    return this.recipeRepo.save(line);
  }
}