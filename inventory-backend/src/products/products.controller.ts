import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' }) 
  @ApiResponse({ status: 201, description: 'El producto fue creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos (Bad Request).' })
  create(@Body() createProductDto: CreateProductDto) {

    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'devulve todos los productos' })
  @ApiResponse({ status: 201, description: 'productos' })
  @ApiResponse({ status: 400, description: 'fallo en la peticion' })
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'devulve solo un producto' })
  @ApiResponse({ status: 201, description: 'producto' })
  @ApiResponse({ status: 400, description: 'fallo en la peticion' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un producto' })
  @ApiResponse({ status: 201, description: 'producto' })
  @ApiResponse({ status: 400, description: 'fallo en la peticion' })
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')

  @ApiOperation({ summary: 'Elimina un producto' })
  @ApiResponse({ status: 201, description: 'producto' })
  @ApiResponse({ status: 400, description: 'fallo en la peticion' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
