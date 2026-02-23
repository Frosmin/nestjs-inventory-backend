import { Product } from "src/products/entities/product.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity('hitories')
export class Histories {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => Product, (product) => product.histories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product!: Product

    @Column({ type: 'jsonb' })
    changes!: Record<string, any>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt!: Date;
}