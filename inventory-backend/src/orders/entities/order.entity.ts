import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OrderStatus } from './order.enum';
import { OrderDetail } from './order-detail.entity';
import { Movement } from 'src/movements/entities/movement.entity'; 

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  client_name!: string;

  @Column({ type: 'varchar', length: 255 })
  addres!: string;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  order_status!: OrderStatus;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  @OneToMany(() => OrderDetail, (detail) => detail.order, { cascade: true })
  details!: OrderDetail[];

  @OneToMany(() => Movement, (movement) => movement.order)
  movements!: Movement[];
}
