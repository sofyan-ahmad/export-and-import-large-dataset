import {
  Controller,
  Get,
  Res,
  Post,
  UseInterceptors,
  UploadedFile,
  Query,
  Delete,
} from '@nestjs/common';
import {ApiTags, ApiConsumes, ApiBody} from '@nestjs/swagger';
import {Crud, CrudController} from '@nestjsx/crud';
import {Order} from './order.entity';
import {OrderService} from './order.service';
import {Response} from 'express';
import {FileInterceptor} from '@nestjs/platform-express';
import {async} from 'rxjs/internal/scheduler/async';

@Crud({
  model: {
    type: Order,
  },
  params: {
    id: {
      type: 'uuid',
      primary: true,
      field: 'id',
    },
  },
})
@ApiTags('Order')
@Controller('orders')
export class OrderController implements CrudController<Order> {
  constructor(readonly service: OrderService) {}

  @Get('count')
  async count(): Promise<number> {
    return this.service.count();
  }

  @Get('download')
  async downloadCsv(
    @Res() res: Response,
    @Query('limit') limit: number,
  ): Promise<void> {
    res.setHeader(
      'Content-disposition',
      `attachment; filename=order_download_${limit}.json`,
    );
    res.set('Content-Type', 'application/octet-stream');
    res.send(await this.service.generateCSV(limit));
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any): Promise<void> {
    this.service.import(JSON.parse(file.buffer));
  }

  @Delete('clear')
  async clear(): Promise<void> {
    await this.service.clear();
  }
}
