import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RawMaterial } from './raw-material.entity.js';

@Entity({ name: 'supplier' })
export class Supplier {
  @PrimaryGeneratedColumn({ name: 'SupplierID' })
  supplierId: number;

  @Column({ name: 'SupplierName', type: 'varchar', length: 100 })
  supplierName: string;

  @Column({ name: 'ContactNumber', type: 'varchar', length: 15 })
  contactNumber: string;

  @Column({ name: 'Address', type: 'varchar', length: 150, nullable: true })
  address: string | null;

  // One supplier can supply many raw materials
  @OneToMany(() => RawMaterial, (material) => material.supplier)
  rawMaterials: RawMaterial[];
}