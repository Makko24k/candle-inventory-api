import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supplier } from '../entities/supplier.entity.js';
import { CreateSupplierDto } from './dto/create-supplier.dto.js';

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier) private supplierRepo: Repository<Supplier>,
  ) {}

  // GET /suppliers
  findAll() {
    return this.supplierRepo.find({ order: { supplierId: 'ASC' } });
  }

  // GET /suppliers/{id}
  async findOne(id: number) {
    const supplier = await this.supplierRepo.findOne({
      where: { supplierId: id },
    });
    if (!supplier) {
      throw new NotFoundException({
        message: 'Supplier not found.',
        errors: [`No supplier exists with ID ${id}.`],
      });
    }
    return supplier;
  }

  // POST /suppliers
  create(dto: CreateSupplierDto) {
    const supplier = this.supplierRepo.create({
      supplierName: dto.supplierName,
      contactNumber: dto.contactNumber,
      address: dto.address ?? null,
    });
    return this.supplierRepo.save(supplier);
  }

  // PUT /suppliers/{id}  (replaces ALL the details)
  async replace(id: number, dto: CreateSupplierDto) {
    const supplier = await this.findOne(id); // 404 if it does not exist
    supplier.supplierName = dto.supplierName;
    supplier.contactNumber = dto.contactNumber;
    supplier.address = dto.address ?? null; // a missing address becomes empty
    return this.supplierRepo.save(supplier);
  }
}