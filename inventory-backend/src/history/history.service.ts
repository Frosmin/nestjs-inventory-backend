import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Histories } from './entities/history.entity';
import { Repository } from 'typeorm';
import { promises } from 'dns';

@Injectable()
export class HistoryService {
    constructor(
        @InjectRepository(Histories)
        private readonly historiesRepository: Repository<Histories>, 
    ) {}

    async getHistoryByProductId(productId: string): Promise<Histories[]>{
        return this.historiesRepository.find({
      where: { product: { id: productId } },
      order: { createdAt: 'DESC' }, 
    });
    }

}
