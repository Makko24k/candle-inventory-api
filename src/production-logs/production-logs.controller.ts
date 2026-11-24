import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { CreateProductionLogDto } from './dto/create-production-log.dto.js';
import { ListProductionLogsQueryDto } from './dto/list-production-logs-query.dto.js';
import { ProductionLogsService } from './production-logs.service.js';

@Controller('production-logs')
@UseGuards(AuthGuard, RolesGuard)
export class ProductionLogsController {
  constructor(private productionLogsService: ProductionLogsService) {}

  @Get()
  findAll(@Query() query: ListProductionLogsQueryDto) {
    return this.productionLogsService.findAll(query);
  }

  @Post()
  @Roles('Admin', 'Staff')
  create(@Body() dto: CreateProductionLogDto, @Req() req: any) {
    // req.user is the token payload that AuthGuard saved; userId comes from there
    return this.productionLogsService.create(dto, req.user.userId);
  }
}