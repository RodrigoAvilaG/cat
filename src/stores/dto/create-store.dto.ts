import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateStoreDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  name!: string;

  @IsString()
  @IsNotEmpty()
  slug!: string;

  @IsString()
  @IsNotEmpty()
  whatsappNumber!: string;

  @IsObject()
  @IsOptional()
  config?: Record<string, any>;
}