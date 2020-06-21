import {Module} from '@nestjs/common';
import {TypeOrmModule, TypeOrmModuleOptions} from '@nestjs/typeorm';

import {Order} from './modules/order/order.entity';
import {OrderModule} from './modules/order/order.module';
import {User} from './modules/user/user.entity';
import {Product} from './modules/product/product.entity';
import {UserModule} from './modules/user/user.module';
import {ProductModule} from './modules/product/product.module';
import 'sqlite3';

export function moduleFactory(): any {
  const dbConfig: TypeOrmModuleOptions = {
    type: 'sqlite',
    database: 'database.sqlite3',
    dropSchema: true,
    entities: [Order, User, Product],
    logging: false,
    synchronize: true,
  };
  @Module({
    imports: [
      TypeOrmModule.forRoot(dbConfig),
      OrderModule,
      UserModule,
      ProductModule,
    ],
  })
  class AppModule {}

  return AppModule;
}
