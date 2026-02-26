import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Product } from 'src/products/entities/product.entity';
import { Movement } from 'src/movements/entities/movement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderDetail, Product, Movement])],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}