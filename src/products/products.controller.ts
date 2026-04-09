import { Controller, Get, Patch, Delete, Post, Body, UseInterceptors, UploadedFile, BadRequestException, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import 'multer';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly cloudinaryService: CloudinaryService, // <-- Lo inyectamos aquí
  ) {}

  // 🔥 ENDPOINT POST
  @Post()
  @UseInterceptors(FileInterceptor('image')) // 🔥 Atrapa el archivo adjunto que se llame "image"
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File, // 🔥 Aquí recibimos el archivo físico
  ) {
    
    // 1. Si el usuario subió una imagen, la mandamos a Cloudinary primero
    if (file) {
      try {
        const uploadResult = await this.cloudinaryService.uploadImage(file);
        
        // 2. Cloudinary nos regresa una URL segura (https://res.cloudinary.com/...)
        // La guardamos en el DTO dentro del arreglo de imágenes
        createProductDto.images = [uploadResult.secure_url]; 
        
      } catch (error) {
        throw new BadRequestException('Error al subir la imagen a Cloudinary');
      }
    }

    // 3. Finalmente, guardamos todo en nuestra base de datos (Neon.tech)
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // 🔥 ENDPOINT PATCH
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // 1. Si mandas una foto nueva, la subimos
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      updateProductDto.images = [uploadResult.secure_url];
    }

    // 2. Mandamos a actualizar (solo los campos que venían en el body o la nueva imagen)
    return this.productsService.update(id, updateProductDto);
  }

  // 🔥 ENDPOINT DELETE
  @Delete(':id')
  remove(@Param('id') id: string) {
    // Extraemos el ID de la URL y se lo pasamos al servicio
    return this.productsService.remove(id);
  }
}