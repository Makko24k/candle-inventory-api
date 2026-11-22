import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Product } from './product.entity.js';
import { User } from './user.entity.js';

@Entity({ name: 'production_log' })
export class ProductionLog {
  @PrimaryGeneratedColumn({ name: 'ProductionID' })
  productionId: number;

  // FK -> Product.ProductID
  @Column({ name: 'ProductID', type: 'int' })
  productId: number;

  // FK -> User.UserID
  @Column({ name: 'UserID', type: 'int' })
  userId: number;

  @Column({ name: 'QuantityProduced', type: 'int' })
  quantityProduced: number;

  @Column({ name: 'DateProduced', type: 'date' })
  dateProduced: string; // 'YYYY-MM-DD'

  @ManyToOne(() => Product, (product) => product.productionLogs)
  @JoinColumn({ name: 'ProductID' })
  product: Relation<Product>;

  @ManyToOne(() => User, (user) => user.productionLogs)
  @JoinColumn({ name: 'UserID' })
  user: Relation<User>;
}