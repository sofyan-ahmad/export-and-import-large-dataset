import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {Repository} from 'typeorm';
import {Order} from './order.entity';
import {Product} from '../product/product.entity';
import {User} from '../user/user.entity';
import {v4 as uuid} from 'uuid';

@Injectable()
export class OrderService extends TypeOrmCrudService<Order> {
  constructor(
    @InjectRepository(Order) protected repo: Repository<Order>,
    @InjectRepository(Product) protected productRepo: Repository<Product>,
    @InjectRepository(User) protected userRepo: Repository<User>,
  ) {
    super(repo);
  }

  async generateCSV(limit = 500000): Promise<Order[]> {
    const users = await this.userRepo.find();
    const products = await this.productRepo.find();

    const orders: Order[] = [];

    for (let i = 0; i < limit; i++) {
      const userData = users[this.random(0, 999)];
      const productData = products[this.random(0, 999)];

      const order: Order = {
        id: uuid(),
        quantity: this.random(1, 100),
        productId: productData.id,
        userId: userData.id,
        product: productData,
        user: userData,
      };

      orders.push(order);
    }

    return orders;
  }

  async import(orders: Order[]): Promise<void> {
    // validation

    const userCache = [];
    const productCache = [];

    await Promise.all(
      orders.map(
        async (order): Promise<void> => {
          if (!userCache[order.userId]) {
            userCache[order.userId] = await this.userRepo.findOneOrFail({
              id: order.userId,
            });
          }

          if (!productCache[order.productId]) {
            productCache[
              order.productId
            ] = await this.productRepo.findOneOrFail({id: order.productId});
          }
        },
      ),
    );

    // save
    this.repo.save(orders, {chunk: 50});
  }

  async clear(): Promise<void> {
    const orders = await this.repo.find();

    orders.map(async (order) => {
      this.repo.delete(order);
    });
  }

  private random(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
