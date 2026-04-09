import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // 🔥 CREAR UN PRODUCTO
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

  // 🔥 MÉTODO BUSCAR TODOS LOS PRODUCTOS
  async findAll() {
    // Cuando buscamos productos, le decimos a TypeORM que también nos traiga 
    // la información de la tienda a la que pertenecen (Join)
    return await this.productRepository.find({
      relations: ['store'] 
    });
  }

  // 🔥 MÉTODO PARA ACTUALIZAR
  async update(id: string, updateProductDto: UpdateProductDto) {
    // preload busca el objeto por ID y le "encima" los nuevos datos del DTO
    const product = await this.productRepository.preload({
      id: id,
      ...updateProductDto,
    });

    if (!product) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }

    return await this.productRepository.save(product);
  }

  // 🔥 MÉTODO PARA BORRAR
  async remove(id: string) {
    // 1. Primero verificamos si el producto realmente existe
    const product = await this.productRepository.findOneBy({ id });
    
    if (!product) {
      throw new NotFoundException(`El producto con el ID ${id} no existe.`);
    }

    // 2. Si existe, lo borramos de la base de datos
    await this.productRepository.remove(product);

    // 3. Regresamos un mensaje de confirmación
    return { 
      message: 'Producto eliminado con éxito',
      deletedId: id 
    };
  }
}