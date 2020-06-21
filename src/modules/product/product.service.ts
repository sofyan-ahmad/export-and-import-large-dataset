import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {Repository} from 'typeorm';
import {Product} from './product.entity';
import {productSeeds} from './product.seed';

@Injectable()
export class ProductService extends TypeOrmCrudService<Product> {
  constructor(@InjectRepository(Product) protected repo: Repository<Product>) {
    super(repo);

    productSeeds.map((seed) => {
      repo.save(seed);
    });
  }
}
