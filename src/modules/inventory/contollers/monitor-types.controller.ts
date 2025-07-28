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
import { CreateMonitorTypeDto, UpdateMonitorTypeDto } from '../dto';
import { MonitorTypesService } from '../services/monitor-types.service';

@Controller('monitor-types')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class MonitorTypesController {
  constructor(private readonly monitorTypesService: MonitorTypesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  create(@Body() createMonitorTypeDto: CreateMonitorTypeDto) {
    return this.monitorTypesService.create(createMonitorTypeDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.monitorTypesService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.monitorTypesService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updateMonitorTypeDto: UpdateMonitorTypeDto,
  ) {
    return this.monitorTypesService.update(id, updateMonitorTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.monitorTypesService.remove(id);
  }
}
