import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';
import { SuppliersService } from './suppliers.service.js';

@Controller('suppliers')
@UseGuards(AuthGuard, RolesGuard)
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Get()
  findAll() {
    return this.suppliersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.suppliersService.findOne(id);
  }

  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(dto);
  }

  @Put(':id')
  @Roles('Admin')
  replace(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateSupplierDto,
  ) {
    return this.suppliersService.replace(id, dto);
  }
}