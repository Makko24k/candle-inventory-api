import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductionLog } from './production-log.entity.js';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ name: 'UserID' })
  userId: number;

  @Column({ name: 'FullName', type: 'varchar', length: 100 })
  fullName: string;

  @Column({ name: 'Username', type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ name: 'Password', type: 'varchar', length: 255 })
  password: string; // will store the HASHED password, never plain text

  @Column({ name: 'Role', type: 'varchar', length: 20 })
  role: string; // 'Admin' or 'Staff'

  // One user can record many production logs
  @OneToMany(() => ProductionLog, (log) => log.user)
  productionLogs: ProductionLog[];
}