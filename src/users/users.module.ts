import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
// Pronto agregaremos el Servicio aquí, por ahora solo queremos que TypeORM cree la tabla

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule], // Lo exportamos porque el Módulo de Auth lo va a necesitar
})
export class UsersModule {}