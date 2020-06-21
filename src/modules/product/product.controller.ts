import {Controller} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Crud, CrudController} from '@nestjsx/crud';
import {Product} from './product.entity';
import {ProductService} from './product.service';

@Crud({
  model: {
    type: Product,
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
  query: {
    join: {
      items: {
        eager: true,
      },
    },
  },
  routes: {
    exclude: ['createOneBase', 'createManyBase', 'deleteOneBase'],
  },
})
@ApiTags('Product')
@Controller('products')
export class ProductController implements CrudController<Product> {
  constructor(readonly service: ProductService) {}
}
