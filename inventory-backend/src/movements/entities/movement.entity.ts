import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MovementType } from './movement.enum';
import { Product } from 'src/products/entities/product.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'enum', enum: MovementType })
  type!: MovementType;

  @Column({ type: 'int' })
  quantity!: number;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product!: Product;
  
  @ManyToOne(() => Order, (order) => order.movements, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'order_id' })
  order!: Order;
}