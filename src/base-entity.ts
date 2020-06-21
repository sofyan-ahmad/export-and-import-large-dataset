import {ApiProperty} from '@nestjs/swagger';
import {PrimaryGeneratedColumn} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({readOnly: true})
  id: string;
}
