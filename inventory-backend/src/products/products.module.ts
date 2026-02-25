import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { Histories } from 'src/history/entities/history.entity';
import { HistoryModule } from 'src/history/history.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Histories]), HistoryModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}