import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

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
        autoLoadEntities: true, // finds our entities automatically
        synchronize: true,      // creates/updates tables from entities (OK for a school project)
      }),
    }),
  ],
})
export class AppModule {}