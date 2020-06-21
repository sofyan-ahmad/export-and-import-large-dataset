import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsEmail} from 'class-validator';
import {Column, Entity, OneToMany} from 'typeorm';
import {BaseEntity} from '../../base-entity';
import {Order} from '../order/order.entity';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty()
  @IsString()
  @Column()
  name: string;

  @ApiProperty()
  @IsEmail()
  @Column()
  email: string;

  @ApiProperty({type: Order, isArray: true})
  @OneToMany(
    () => Order,
    (_) => _.user,
  )
  order?: Order[];
}
