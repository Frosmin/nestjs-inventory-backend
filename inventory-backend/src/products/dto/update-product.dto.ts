import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {

  // 1. @ApiProperty es para que Swagger dibuje la documentación automáticamente
  @ApiProperty({
    description: 'El nombre del producto. Debe ser único en la base de datos.',
    example: 'Laptop ASUS Vivobook',
  })
  // 2. Estos decoradores son de class-validator para la seguridad
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  name!: string;

  @ApiPropertyOptional({
    description: 'Descripción detallada del producto',
    example: 'Laptop ideal para estudiantes, con procesador Intel Celeron N4020 y 4GB de RAM.',
  })
  @IsString()
  @IsOptional() // Significa que el usuario no está obligado a enviarlo
  description?: string;

  @ApiProperty({
    description: 'El precio de venta del producto. No puede ser negativo.',
    example: 2500.50,
  })
  @IsNumber({}, { message: 'El precio debe ser un número válido' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price!: number;

  @ApiPropertyOptional({
    description: 'Cantidad inicial de stock. Por defecto es 0.',
    example: 15,
  })
  @IsNumber()
  @Min(0, { message: 'El stock no puede ser negativo' })
  @IsOptional()
  stock?: number;

  @ApiPropertyOptional({
    description: 'Estado del producto (Activo/Inactivo)',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
