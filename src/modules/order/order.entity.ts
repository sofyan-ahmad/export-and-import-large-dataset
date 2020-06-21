import {ApiProperty} from '@nestjs/swagger';
import {IsNumber, IsUUID} from 'class-validator';
import {Column, ManyToOne, Entity} from 'typeorm';
import {Product} from '../product/product.entity';
import {User} from '../user/user.entity';
import {BaseEntity} from '../../base-entity';

@Entity('order')
export class Order extends BaseEntity {
  @ApiProperty()
  @IsNumber()
  @Column()
  quantity: number;

  @ApiProperty()
  @IsUUID()
  @Column()
  productId: string;

  @ApiProperty()
  @IsUUID()
  @Column()
  userId: string;

  @ApiProperty({type: Product})
  @ManyToOne(
    () => Product,
    (_) => _.order,
  )
  product?: Product;

  @ApiProperty({type: User})
  @ManyToOne(
    () => User,
    (_) => _.order,
  )
  user?: User;
}
