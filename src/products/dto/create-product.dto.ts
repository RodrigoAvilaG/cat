import { IsString, IsNotEmpty, IsNumber, IsOptional, IsArray, IsUUID, Min } from 'class-validator';

export class CreateProductDto {
  // 🔥 Regla vital: Necesitamos saber a qué tienda se va a asociar este producto
  @IsUUID('4', { message: 'El ID de la tienda debe ser un UUID válido' })
  @IsNotEmpty()
  storeId!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price!: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @IsArray()
  @IsString({ each: true }) // Esto asegura que si mandan un arreglo, cada elemento sea texto
  @IsOptional()
  images?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  // 🔥 Nuestro campo dinámico para Tallas, Tamaños, Salsas, etc.
  @IsArray()
  @IsOptional()
  extras?: any[]; 
}