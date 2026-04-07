import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { Store } from './entities/store.entity';

@Injectable()
export class StoresService {
  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async create(createStoreDto: CreateStoreDto) {
    try {
      // 1. Creamos la instancia de la entidad
      const store = this.storeRepository.create(createStoreDto);
      
      // 2. La guardamos en la base de datos de Neon.tech
      return await this.storeRepository.save(store);

    } catch (error: any) {
      // Manejo de errores profesional:
      // '23505' es el código de error nativo de Postgres para "Violación de restricción UNIQUE"
      if (error.code === '23505') {
        throw new BadRequestException(`The store with the following URL '/cat/${createStoreDto.slug}' already exist.`);
      }
      // Si es otro error raro de la base de datos, lanzamos un error 500
      throw new InternalServerErrorException('Unexpected errors while creating a store. Please check logs.');
    }
  }

  async findAll() {
    // Obtenemos todas las tiendas de la base de datos
    return await this.storeRepository.find();
  }

  async findBySlug(slug: string) {
    const store = await this.storeRepository.findOne({ 
      where: { slug } 
    });

    // Regla de negocio: Si alguien entra a una URL de una tienda que no existe, damos error 404
    if (!store) {
      throw new NotFoundException(`The store with the following URL '/cat/${slug}' doesn't exist.`);
    }

    return store;
  }
}