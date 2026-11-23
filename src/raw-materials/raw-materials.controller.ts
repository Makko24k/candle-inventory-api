import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { CreateRawMaterialDto } from './dto/create-raw-material.dto.js';
import { ListRawMaterialsQueryDto } from './dto/list-raw-materials-query.dto.js';
import { UpdateRawMaterialDto } from './dto/update-raw-material.dto.js';
import { RawMaterialsService } from './raw-materials.service.js';

// Every endpoint here needs a valid token (AuthGuard).
// RolesGuard then checks @Roles(...) where we use it.
@Controller('raw-materials')
@UseGuards(AuthGuard, RolesGuard)
export class RawMaterialsController {
  constructor(private rawMaterialsService: RawMaterialsService) {}

  @Get()
  findAll(@Query() query: ListRawMaterialsQueryDto) {
    return this.rawMaterialsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rawMaterialsService.findOne(id);
  }

  @Post()
  @Roles('Admin')
  create(@Body() dto: CreateRawMaterialDto) {
    return this.rawMaterialsService.create(dto); // 201 Created by default
  }

  @Patch(':id')
  @Roles('Admin', 'Staff')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRawMaterialDto,
  ) {
    return this.rawMaterialsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('Admin')
  @HttpCode(204) // success, nothing to send back
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rawMaterialsService.remove(id);
  }
}