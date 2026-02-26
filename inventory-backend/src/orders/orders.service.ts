import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { Movement } from 'src/movements/entities/movement.entity';
import { MovementType } from 'src/movements/entities/movement.enum'; 
import { OrderStatus } from './entities/order.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource, 
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      
      const order = queryRunner.manager.create(Order, {
        client_name: createOrderDto.client_name ,
        address: createOrderDto.address,
        status: OrderStatus.PENDING,
      });
      const savedOrder = await queryRunner.manager.save(order);

      
      for (const item of createOrderDto.items) {
        
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId, is_active: true },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
          throw new NotFoundException(`Producto con ID ${item.productId} no encontrado o inactivo`);
        }

        
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Stock insuficiente para el producto ${product.name}. Disponible: ${product.stock}, Solicitado: ${item.quantity}`,
          );
        }

       
        product.stock -= item.quantity;
        await queryRunner.manager.save(product);

        
        const orderDetail = queryRunner.manager.create(OrderDetail, {
          order: savedOrder,
          product: product,
          quantity: item.quantity,
          unit_price: product.price, 
        });
        await queryRunner.manager.save(orderDetail);


        const movement = queryRunner.manager.create(Movement, {
          type: MovementType.OUT,
          quantity: item.quantity,
          product: product,
          order: savedOrder,
        });
        await queryRunner.manager.save(movement);
      }

      
      await queryRunner.commitTransaction();
      
      
      return { message: 'Orden creada exitosamente', orderId: savedOrder.id };

    } catch (error) {
      
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      
      await queryRunner.release();
    }
  }


}