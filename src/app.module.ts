import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoresModule } from './stores/stores.module';
import { ProductsModule } from './products/products.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Módulo de Configuración: Lee el archivo .env y lo hace disponible en toda la app
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    // 2. Módulo de TypeORM: Conexión asíncrona a Neon.tech
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'), // Leemos la URL segura
        autoLoadEntities: true, // Magia: buscará automáticamente nuestras entidades
        synchronize: true, // ATENCIÓN: Crea/Modifica las tablas automáticamente. (Solo usar en Desarrollo)
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false, // Requerido por algunos proveedores cloud como Neon
          },
        },
      }),
    }),

    // 3. Nuestro módulo de tiendas
    StoresModule,
    ProductsModule,
    CloudinaryModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}