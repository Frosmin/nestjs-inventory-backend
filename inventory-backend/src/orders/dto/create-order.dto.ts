import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsUUID, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class OrderItemDto {
  @ApiProperty({ description: 'ID del producto (UUID)' })
  @IsUUID()
  @IsNotEmpty()
  productId!: string;

  @ApiProperty({ description: 'Cantidad a comprar', minimum: 1 })
  @IsInt()
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre del cliente' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del cliente es obligatorio' })
  client_name!: string;

  @ApiProperty({ example: 'Av. Blanco Galindo Km 3', description: 'Dirección de entrega' })
  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  address!: string;

  @ApiProperty({ type: [OrderItemDto], description: 'Lista de productos a comprar' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @IsNotEmpty({ message: 'La orden debe contener al menos un producto' })
  items!: OrderItemDto[];
}