import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
      // 1. Extraemos el storeId y el resto de los datos
      const { storeId, ...productData } = createProductDto;

      // 2. Preparamos el objeto. TypeORM es inteligente: si le pasamos { store: { id } }, 
      // él sabe que debe conectarlo con esa tienda por llave foránea.
      const product = this.productRepository.create({
        ...productData,
        store: { id: storeId }
      });

      // 3. Guardamos en la base de datos de Neon
      return await this.productRepository.save(product);

    } catch (error: any) {
      // 23503 es el código de Postgres para "Violación de Llave Foránea" (Foreign Key Violation)
      if (error.code === '23503') {
        throw new NotFoundException(`La tienda con el ID proporcionado no existe.`);
      }
      throw new InternalServerErrorException('Error al crear el producto. Revisa los logs.');
    }
  }

  async findAll() {
    // Cuando buscamos productos, le decimos a TypeORM que también nos traiga 
    // la información de la tienda a la que pertenecen (Join)
    return await this.productRepository.find({
      relations: ['store'] 
    });
  }
}