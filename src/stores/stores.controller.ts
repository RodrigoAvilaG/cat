import { Controller, Get, Post, Body } from '@nestjs/common';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';

@Controller('stores') // Esto significa que la ruta será http://localhost:3000/stores
export class StoresController {
  // Inyección de dependencias: NestJS nos pasa el Servicio automáticamente
  constructor(private readonly storesService: StoresService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    // Aquí recibimos el JSON ya validado y se lo pasamos al servicio
    return this.storesService.create(createStoreDto);
  }

  @Get()
  findAll() {
    return this.storesService.findAll();
  }
}