import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';

@Injectable()
export class StoresService {
  // SIMULACIÓN DE BASE DE DATOS: 
  // Este arreglo guardará nuestras tiendas temporalmente en la memoria RAM
  private stores: any[] = [];

  create(createStoreDto: CreateStoreDto) {
    // 1. Regla de negocio: El slug debe ser único para que las URLs no choquen
    const storeExists = this.stores.find(store => store.slug === createStoreDto.slug);
    
    if (storeExists) {
      // Si ya existe, lanzamos un error que NestJS convertirá automáticamente en un 400 Bad Request
      throw new BadRequestException(`La tienda con la URL '/cat/${createStoreDto.slug}' ya existe`);
    }

    // 2. Si no existe, preparamos el objeto a guardar (simulando que la BD le asigna un ID)
    const newStore = {
      id: Date.now().toString(), // Generamos un ID falso temporal
      ...createStoreDto,
      createdAt: new Date(),
    };

    // 3. Lo guardamos en nuestro "arreglo-base de datos"
    this.stores.push(newStore);

    // 4. Devolvemos la tienda creada
    return newStore;
  }

  // Método para ver todas las tiendas que hemos creado
  findAll() {
    return this.stores;
  }
}