import {
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Public } from './common/decorators';

@Controller('/')
@Public()
export class AppController {
  @Get()
  @HttpCode(HttpStatus.OK)
  index() {
    throw new HttpException(
      `Bienvenido a la API de SPI, si desea ver la documentación, ingrese a: /api`,
      HttpStatus.OK,
    );
  }
}
