import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { decimalTransformer } from './decimal.transformer.js';
import { Product } from './product.entity.js';
import { RawMaterial } from './raw-material.entity.js';

@Entity({ name: 'product_material' })
export class ProductMaterial {
  @PrimaryGeneratedColumn({ name: 'ProductMaterialID' })
  productMaterialId: number;

  // FK -> Product.ProductID
  @Column({ name: 'ProductID', type: 'int' })
  productId: number;

  // FK -> RawMaterial.MaterialID
  @Column({ name: 'MaterialID', type: 'int' })
  materialId: number;

  @Column({
    name: 'QuantityNeeded',
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer,
  })
  quantityNeeded: number;

  @ManyToOne(() => Product, (product) => product.productMaterials)
  @JoinColumn({ name: 'ProductID' })
  product: Relation<Product>;

  @ManyToOne(() => RawMaterial, (material) => material.productMaterials)
  @JoinColumn({ name: 'MaterialID' })
  material: Relation<RawMaterial>;
}