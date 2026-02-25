import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductsModule } from './products/products.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [ProductsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),


    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      entities: [],
      logging: true,
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: true,


    }),


    HistoryModule,],
  controllers: [AppController],
  providers: [AppService],


})
export class AppModule { }
