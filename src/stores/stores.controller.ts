import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StoresService } from './stores.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Controller('stores') // http://localhost:3000/stores
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // 🛑 RUTA PROTEGIDA (Solo tú puedes crear tiendas)
  @UseGuards(AuthGuard('jwt')) // <-- 2. Ponemos el candado
  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storesService.create(createStoreDto);
  }

  // 🔥 RUTAS PÚBLICAS (Los clientes pueden ver el catálogo)
  @Get()
  findAll() {
    return this.storesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  // 🛑 RUTAS PROTEGIDAS (Solo tú puedes editar o borrar)
  @UseGuards(AuthGuard('jwt')) // <-- 2. Ponemos el candado
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storesService.update(id, updateStoreDto);
  }

  @UseGuards(AuthGuard('jwt')) // <-- 2. Ponemos el candado
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storesService.remove(id);
  }
}