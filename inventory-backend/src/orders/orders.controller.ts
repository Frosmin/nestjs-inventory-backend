import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

@Post()
  @ApiOperation({ summary: 'Crear una nueva orden de compra' })
  @ApiResponse({ status: 201, description: 'Orden creada exitosamente.' })
  @ApiResponse({ status: 400, description: 'Stock insuficiente o datos inválidos.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado.' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }


}
