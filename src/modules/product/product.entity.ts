import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsNumber} from 'class-validator';
import {Column, Entity, OneToMany} from 'typeorm';
import {BaseEntity} from '../../base-entity';
import {Order} from '../order/order.entity';

@Entity('products')
export class Product extends BaseEntity {
  @ApiProperty()
  @IsString()
  @Column()
  productName: string;

  @ApiProperty()
  @IsNumber()
  @Column()
  price: number;

  @ApiProperty({type: Order, isArray: true})
  @OneToMany(
    () => Order,
    (_) => _.product,
  )
  order?: Order[];
}
