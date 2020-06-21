import {Controller} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {Crud, CrudController} from '@nestjsx/crud';
import {User} from './user.entity';
import {UserService} from './user.service';

@Crud({
  model: {
    type: User,
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
})
@ApiTags('User')
@Controller('users')
export class UserController implements CrudController<User> {
  constructor(readonly service: UserService) {}
}
