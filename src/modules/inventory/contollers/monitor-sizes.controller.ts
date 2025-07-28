import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Roles } from 'src/common/decorators';
import { EUserRole } from 'src/common/enums';
import { ValidateIdPipe } from 'src/common/pipes';
import { CreateMonitorSizeDto, UpdateMonitorSizeDto } from '../dto';
import { MonitorSizesService } from '../services/monitor-sizes.service';

@Controller('monitor-sizes')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class MonitorSizesController {
  constructor(private readonly monitorSizesService: MonitorSizesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  create(@Body() createMonitorSizeDto: CreateMonitorSizeDto) {
    return this.monitorSizesService.create(createMonitorSizeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.monitorSizesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.monitorSizesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateMonitorSizeDto: UpdateMonitorSizeDto,
  ) {
    return this.monitorSizesService.update(id, updateMonitorSizeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.monitorSizesService.remove(id);
  }
}
