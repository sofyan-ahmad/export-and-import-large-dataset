import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {TypeOrmCrudService} from '@nestjsx/crud-typeorm';
import {Repository} from 'typeorm';

import {User} from './user.entity';
import {userSeeds} from './user.seed';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  constructor(@InjectRepository(User) protected repo: Repository<User>) {
    super(repo);

    userSeeds.map((seed) => {
      repo.save(seed);
    });
  }
}
