import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { decimalTransformer } from './decimal.transformer.js';
import { ProductMaterial } from './product-material.entity.js';
import { Supplier } from './supplier.entity.js';

@Entity({ name: 'raw_material' })
export class RawMaterial {
  @PrimaryGeneratedColumn({ name: 'MaterialID' })
  materialId: number;

  @Column({ name: 'MaterialName', type: 'varchar', length: 100 })
  materialName: string;

  @Column({ name: 'Unit', type: 'varchar', length: 20 })
  unit: string;

  @Column({
    name: 'QuantityInStock',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  quantityInStock: number;

  @Column({
    name: 'ReorderLevel',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  reorderLevel: number;

  // The foreign key column (FK -> Supplier.SupplierID)
  @Column({ name: 'SupplierID', type: 'int' })
  supplierId: number;

  // Many raw materials belong to one supplier
  @ManyToOne(() => Supplier, (supplier) => supplier.rawMaterials)
  @JoinColumn({ name: 'SupplierID' })
  supplier: Relation<Supplier>;

  // One raw material can appear in many recipes
  @OneToMany(() => ProductMaterial, (pm) => pm.material)
  productMaterials: ProductMaterial[];
}