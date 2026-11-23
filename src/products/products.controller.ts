import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { AddRecipeMaterialDto } from './dto/add-recipe-material.dto.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductsService } from './products.service.js';

@Controller('products')
@UseGuards(AuthGuard, RolesGuard)
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @Roles('Admin')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productsService.update(id, dto);
  }

  // The recipe: a nested resource under products
  @Get(':id/materials')
  getRecipe(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getRecipe(id);
  }

  @Post(':id/materials')
  @Roles('Admin')
  addToRecipe(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AddRecipeMaterialDto,
  ) {
    return this.productsService.addToRecipe(id, dto);
  }
}