import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { decimalTransformer } from './decimal.transformer.js';
import { ProductMaterial } from './product-material.entity.js';
import { ProductionLog } from './production-log.entity.js';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn({ name: 'ProductID' })
  productId: number;

  @Column({ name: 'ProductName', type: 'varchar', length: 100 })
  productName: string;

  @Column({ name: 'Scent', type: 'varchar', length: 50, nullable: true })
  scent: string | null;

  @Column({
    name: 'Price',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  price: number;

  @Column({ name: 'QuantityInStock', type: 'int', default: 0 })
  quantityInStock: number;

  // One product has many recipe lines
  @OneToMany(() => ProductMaterial, (pm) => pm.product)
  productMaterials: ProductMaterial[];

  // One product has many production logs
  @OneToMany(() => ProductionLog, (log) => log.product)
  productionLogs: ProductionLog[];
}