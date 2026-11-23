import { AuthModule } from './auth/auth.module.js';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity.js';
import { ProductMaterial } from './entities/product-material.entity.js';
import { ProductionLog } from './entities/production-log.entity.js';
import { RawMaterial } from './entities/raw-material.entity.js';
import { Supplier } from './entities/supplier.entity.js';
import { User } from './entities/user.entity.js';
import { RawMaterialsModule } from './raw-materials/raw-materials.module.js';
import { SuppliersModule } from './suppliers/suppliers.module.js';
import { ProductsModule } from './products/products.module.js';

@Module({
  imports: [
    // Reads the .env file
    ConfigModule.forRoot({ isGlobal: true }),

    // Connects the app to MySQL using the .env values
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: Number(config.get('DB_PORT')),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        // The 6 tables from Lab 04
        entities: [
          User,
          Supplier,
          RawMaterial,
          Product,
          ProductMaterial,
          ProductionLog,
        ],
        synchronize: true, // creates the tables from the entities (OK for a school project)
      }),
    }),
    AuthModule, // handles Login and JWT authentication
    RawMaterialsModule, // handles the /raw-materials routes
    SuppliersModule, // handles the /suppliers routes
    ProductsModule, // handles the /products routes
  ],
})
export class AppModule {}