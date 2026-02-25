import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';
import { promises } from 'dns';
import { Histories } from 'src/history/entities/history.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly dataSource : DataSource,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = this.productRepository.create(createProductDto);
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return await this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    const product =  await this.productRepository.findOne({ where: { id } });
    if (!product){
      throw new NotFoundException('producto no encontrado');
    }

    return product;
  }

async update(id: string, updateProductDto: UpdateProductDto) {
    // 1. Buscamos el producto tal cual está en la base de datos ahora
    const originalProduct = await this.findOne(id);

    // 2. Comparamos para ver qué campos cambiaron realmente
    const changes: Record<string, any> = {};
    for (const key in updateProductDto) {
      if (originalProduct[key] !== updateProductDto[key]) {
        changes[key] = {
          from: originalProduct[key],
          to: updateProductDto[key],
        };
      }
    }

    // Si enviaron un PATCH pero no cambió ningún valor, no hacemos nada
    if (Object.keys(changes).length === 0) {
      return originalProduct;
    }

    // 3. Iniciamos la transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 4. Preparamos el producto actualizado
      const updatedProduct = await queryRunner.manager.preload(Product, {
        id: id,
        ...updateProductDto,
      });

      // Guardamos el producto (dentro de la transacción)
      await queryRunner.manager.save(updatedProduct);

      // 5. Creamos y guardamos el registro en el historial (dentro de la transacción)
      const historyRecord = queryRunner.manager.create(Histories, {
        product: updatedProduct,
        changes: changes,
      });
      await queryRunner.manager.save(historyRecord);

      // 6. Si todo salió bien, confirmamos (commit) los cambios en la BD
      await queryRunner.commitTransaction();

      return updatedProduct;
    } catch (error) {
      // Si algo falla (ej. error de validación de base de datos), revertimos TODO
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // Liberamos el queryRunner
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { deleted: true };
  }
}