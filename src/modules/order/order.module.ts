import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {OrderController} from './order.controller';
import {Order} from './order.entity';
import {OrderService} from './order.service';
import {User} from '../user/user.entity';
import {Product} from '../product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
