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
import { PcEquipmentsService } from '../services/pc-equipments.service';
import { CreatePcEquipmentDto, UpdatePcEquipmentDto } from '../dto';

@Controller('pc-equipments')
@Roles(
  EUserRole.ADMIN,
  EUserRole.DIRECCION,
  EUserRole.RRHH,
  EUserRole.COORDINADOR_AREA,
)
export class PcEquipmentsController {
  constructor(private readonly pcEquipmentsService: PcEquipmentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  create(@Body() createPcEquipmentDto: CreatePcEquipmentDto) {
    return this.pcEquipmentsService.create(createPcEquipmentDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.pcEquipmentsService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param(ValidateIdPipe) id: string) {
    return this.pcEquipmentsService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  update(
    @Param(ValidateIdPipe) id: string,
    @Body() updatePcEquipmentDto: UpdatePcEquipmentDto,
  ) {
    return this.pcEquipmentsService.update(id, updatePcEquipmentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(EUserRole.ADMIN, EUserRole.DIRECCION, EUserRole.RRHH)
  remove(@Param(ValidateIdPipe) id: string) {
    return this.pcEquipmentsService.remove(id);
  }
}
